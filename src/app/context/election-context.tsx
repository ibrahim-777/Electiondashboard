import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  partyListsAPI,
  candidatesAPI,
  pollingBoxesAPI,
  votesAPI,
  votersAPI,
  mandubsAPI,
  carsAPI,
} from '../services/api';
import { initialPartyLists, initialPollingBoxes, initialMandubs, initialVoters } from './mock-data';

export interface Candidate {
  id: number;
  name: string;
  personalVotes: number;
  block: 1 | 2 | 3;
  religion: string;
  rank?: number;
  wonSeat?: boolean;
}

export interface PartyList {
  id: number;
  name: string;
  shortName: string;
  color: string;
  votes: number;
  candidates: Candidate[];
}

export interface PollingBox {
  id: number;
  name: string;
  block: 1 | 2 | 3;
  blockName: string;
  center: string;
  room: string;
  district: string;
  isOpened: boolean;
  hasVotes: boolean;
}

export interface BoxVotes {
  boxId: number;
  listVotes: { [listId: number]: number };
  candidateVotes: { [candidateId: number]: number };
  rejectedVotes: number;
  blankVotes: number;
  totalVotes: number;
}

export interface VoterData {
  id: number;
  name: string;
  fatherName: string;
  motherName: string;
  recordNumber: string;
  birthday: string;
  sex: 'ذكر' | 'أنثى';
  block: string;
  district: string;
  center?: string;
  room?: string;
  elected?: boolean;
  status?: 'none' | 'green' | 'red' | 'yellow';
}

export interface Mandub {
  id: number;
  name: string;
  block: string;
  district: string;
  recordNumber: number;
  religion: string;
  phoneNumber: string;
  phoneCardType: 'alfa' | 'touch';
  mandubType: 'مندوب ثابت' | 'مندوب جوال' | 'رئيس مركز' | 'رئيس نفوس' | 'مندوب جوال سيارة';
  representative: string;
  sex: 'ذكر' | 'أنثى';
}

export interface CenterAssignment {
  roomId: number; // polling box id
  mandubId: number;
}

export interface Car {
  id: number;
  type: string; // نوع السيارة
  owner: number; // mandub ID - المالك
  plateNumber: string; // رقم اللوحة
  representative: string; // رقم المعرف (1-11)
  isAvailable: boolean; // متاحة/غير متاحة
  block: string; // المنطقة
  numberOfTours: number; // عدد الجولات
}

interface ElectionContextType {
  partyLists: PartyList[];
  pollingBoxes: PollingBox[];
  boxVotes: BoxVotes[];
  voters: VoterData[];
  mandubs: Mandub[];
  centerAssignments: CenterAssignment[];
  cars: Car[];
  loading: boolean;
  error: string | null;
  addPartyList: (list: Omit<PartyList, 'id'>) => Promise<void>;
  updatePartyList: (id: number, list: Partial<PartyList>) => Promise<void>;
  deletePartyList: (id: number) => Promise<void>;
  addCandidate: (listId: number, candidate: Omit<Candidate, 'id' | 'rank' | 'wonSeat'>) => Promise<void>;
  updateCandidate: (listId: number, candidateId: number, candidate: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (listId: number, candidateId: number) => Promise<void>;
  addBoxVotes: (boxId: number, listVotes: { [listId: number]: number }, candidateVotes: { [candidateId: number]: number }, rejectedVotes: number, blankVotes: number, totalVotes: number) => Promise<void>;
  getBoxVotes: (boxId: number) => BoxVotes | null;
  updateBoxStatus: (boxId: number, isOpened: boolean) => Promise<void>;
  getBlockStatistics: () => Array<{
    block: number;
    blockName: string;
    totalBoxes: number;
    openedBoxes: number;
    boxesWithVotes: number;
  }>;
  updateVoterStatus: (voterId: number, elected: boolean) => Promise<void>;
  updateVoterStatusColor: (voterId: number, status: 'none' | 'green' | 'red' | 'yellow') => Promise<void>;
  getVotingStatistics: () => Array<{
    block: number;
    blockName: string;
    totalVoters: number;
    votedCount: number;
    percentage: number;
  }>;
  addMandub: (mandub: Omit<Mandub, 'id'>) => Promise<void>;
  updateMandub: (id: number, mandub: Partial<Mandub>) => Promise<void>;
  deleteMandub: (id: number) => Promise<void>;
  assignMandubToRoom: (roomId: number, mandubId: number) => void;
  unassignMandubFromRoom: (roomId: number) => void;
  getCenterStatistics: () => {
    totalCenters: number;
    fullCenters: number;
    emptyCenters: number;
  };
  addCar: (car: Omit<Car, 'id'>) => Promise<void>;
  updateCar: (id: number, car: Partial<Car>) => Promise<void>;
  deleteCar: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [partyLists, setPartyLists] = useState<PartyList[]>([]);
  const [pollingBoxes, setPollingBoxes] = useState<PollingBox[]>([]);
  const [boxVotes, setBoxVotes] = useState<BoxVotes[]>([]);
  const [voters, setVoters] = useState<VoterData[]>([]);
  const [mandubs, setMandubs] = useState<Mandub[]>([]);
  const [centerAssignments, setCenterAssignments] = useState<CenterAssignment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data from API on mount
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        partyListsRes,
        pollingBoxesRes,
        votesRes,
        votersRes,
        mandubsRes,
        carsRes,
      ] = await Promise.all([
        partyListsAPI.getAll(),
        pollingBoxesAPI.getAll(),
        votesAPI.getAll(),
        votersAPI.getAll(),
        mandubsAPI.getAll(),
        carsAPI.getAll(),
      ]);

      setPartyLists(partyListsRes.data);
      setPollingBoxes(pollingBoxesRes.data);
      setBoxVotes(votesRes.data);
      setVoters(votersRes.data);
      setMandubs(mandubsRes.data);
      setCars(carsRes.data);
    } catch (err: any) {
      console.warn('Backend not available, using mock data:', err.message);
      // Use mock data as fallback
      setPartyLists(initialPartyLists);
      setPollingBoxes(initialPollingBoxes);
      setBoxVotes([]);
      setVoters(initialVoters);
      setMandubs(initialMandubs);
      setCars([]);
      setError(null); // Don't show error, just use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = async () => {
    await fetchAllData();
  };

  // Party Lists operations
  const addPartyList = async (list: Omit<PartyList, 'id'>) => {
    try {
      const response = await partyListsAPI.create(list);
      setPartyLists([...partyLists, response.data]);
    } catch (err: any) {
      console.error('Error adding party list:', err);
      throw err;
    }
  };

  const updatePartyList = async (id: number, updates: Partial<PartyList>) => {
    try {
      const response = await partyListsAPI.update(id, updates);
      setPartyLists(partyLists.map(list => 
        list.id === id ? response.data : list
      ));
    } catch (err: any) {
      console.error('Error updating party list:', err);
      throw err;
    }
  };

  const deletePartyList = async (id: number) => {
    try {
      await partyListsAPI.delete(id);
      setPartyLists(partyLists.filter(list => list.id !== id));
    } catch (err: any) {
      console.error('Error deleting party list:', err);
      throw err;
    }
  };

  // Candidates operations
  const addCandidate = async (listId: number, candidate: Omit<Candidate, 'id' | 'rank' | 'wonSeat'>) => {
    try {
      const response = await candidatesAPI.create({ ...candidate, listId });
      setPartyLists(partyLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            candidates: [...list.candidates, response.data]
          };
        }
        return list;
      }));
    } catch (err: any) {
      console.error('Error adding candidate:', err);
      throw err;
    }
  };

  const updateCandidate = async (listId: number, candidateId: number, updates: Partial<Candidate>) => {
    try {
      const response = await candidatesAPI.update(candidateId, updates);
      setPartyLists(partyLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            candidates: list.candidates.map(c => 
              c.id === candidateId ? response.data : c
            )
          };
        }
        return list;
      }));
    } catch (err: any) {
      console.error('Error updating candidate:', err);
      throw err;
    }
  };

  const deleteCandidate = async (listId: number, candidateId: number) => {
    try {
      await candidatesAPI.delete(candidateId);
      setPartyLists(partyLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            candidates: list.candidates.filter(c => c.id !== candidateId)
          };
        }
        return list;
      }));
    } catch (err: any) {
      console.error('Error deleting candidate:', err);
      throw err;
    }
  };

  // Votes operations
  const addBoxVotes = async (
    boxId: number,
    listVotes: { [listId: number]: number },
    candidateVotes: { [candidateId: number]: number },
    rejectedVotes: number,
    blankVotes: number,
    totalVotes: number
  ) => {
    try {
      const voteData = {
        boxId,
        listVotes,
        candidateVotes,
        rejectedVotes,
        blankVotes,
        totalVotes
      };

      await votesAPI.create(voteData);

      // Update local state
      const updatedBoxVotes = boxVotes.filter(v => v.boxId !== boxId);
      setBoxVotes([...updatedBoxVotes, voteData]);

      // Update polling box status
      setPollingBoxes(pollingBoxes.map(box => 
        box.id === boxId ? { ...box, hasVotes: true } : box
      ));

      // Refresh party lists to get updated vote counts
      const partyListsRes = await partyListsAPI.getAll();
      setPartyLists(partyListsRes.data);
    } catch (err: any) {
      console.error('Error adding box votes:', err);
      throw err;
    }
  };

  const getBoxVotes = (boxId: number) => {
    return boxVotes.find(votes => votes.boxId === boxId) || null;
  };

  const updateBoxStatus = async (boxId: number, isOpened: boolean) => {
    try {
      await pollingBoxesAPI.update(boxId, { isOpened });
      setPollingBoxes(pollingBoxes.map(box => 
        box.id === boxId ? { ...box, isOpened } : box
      ));
    } catch (err: any) {
      console.error('Error updating box status:', err);
      throw err;
    }
  };

  const getBlockStatistics = () => {
    const blockStats: Array<{
      block: number;
      blockName: string;
      totalBoxes: number;
      openedBoxes: number;
      boxesWithVotes: number;
    }> = [];

    const blocks = pollingBoxes.reduce((acc, box) => {
      if (!acc[box.block]) {
        acc[box.block] = {
          block: box.block,
          blockName: box.blockName,
          totalBoxes: 0,
          openedBoxes: 0,
          boxesWithVotes: 0,
        };
      }
      acc[box.block].totalBoxes += 1;
      if (box.isOpened) {
        acc[box.block].openedBoxes += 1;
      }
      if (box.hasVotes) {
        acc[box.block].boxesWithVotes += 1;
      }
      return acc;
    }, {} as { [block: number]: {
      block: number;
      blockName: string;
      totalBoxes: number;
      openedBoxes: number;
      boxesWithVotes: number;
    } });

    for (const block in blocks) {
      blockStats.push(blocks[block]);
    }

    return blockStats;
  };

  // Voters operations
  const updateVoterStatus = async (voterId: number, elected: boolean) => {
    try {
      await votersAPI.markAsElected(voterId);
      setVoters(voters.map(voter => 
        voter.id === voterId ? { ...voter, elected } : voter
      ));
    } catch (err: any) {
      console.error('Error updating voter status:', err);
      throw err;
    }
  };

  const updateVoterStatusColor = async (voterId: number, status: 'none' | 'green' | 'red' | 'yellow') => {
    try {
      await votersAPI.updateStatus(voterId, status);
      setVoters(voters.map(voter => 
        voter.id === voterId ? { ...voter, status } : voter
      ));
    } catch (err: any) {
      console.error('Error updating voter status color:', err);
      throw err;
    }
  };

  const getVotingStatistics = () => {
    const blockStats: Array<{
      block: number;
      blockName: string;
      totalVoters: number;
      votedCount: number;
      percentage: number;
    }> = [];

    const blocks = voters.reduce((acc, voter) => {
      const blockNumber = parseInt(voter.block);
      if (!acc[blockNumber]) {
        acc[blockNumber] = {
          block: blockNumber,
          blockName: pollingBoxes.find(box => box.block === blockNumber)?.blockName || '',
          totalVoters: 0,
          votedCount: 0,
          percentage: 0,
        };
      }
      acc[blockNumber].totalVoters += 1;
      if (voter.elected) {
        acc[blockNumber].votedCount += 1;
      }
      acc[blockNumber].percentage = acc[blockNumber].votedCount / acc[blockNumber].totalVoters * 100;
      return acc;
    }, {} as { [block: number]: {
      block: number;
      blockName: string;
      totalVoters: number;
      votedCount: number;
      percentage: number;
    } });

    for (const block in blocks) {
      blockStats.push(blocks[block]);
    }

    return blockStats.sort((a, b) => a.block - b.block);
  };

  // Mandubin operations
  const addMandub = async (mandub: Omit<Mandub, 'id'>) => {
    try {
      const response = await mandubsAPI.create(mandub);
      setMandubs([...mandubs, response.data]);
    } catch (err: any) {
      console.error('Error adding mandub:', err);
      throw err;
    }
  };

  const updateMandub = async (id: number, updates: Partial<Mandub>) => {
    try {
      const response = await mandubsAPI.update(id, updates);
      setMandubs(mandubs.map(mandub => 
        mandub.id === id ? response.data : mandub
      ));
    } catch (err: any) {
      console.error('Error updating mandub:', err);
      throw err;
    }
  };

  const deleteMandub = async (id: number) => {
    try {
      await mandubsAPI.delete(id);
      setMandubs(mandubs.filter(mandub => mandub.id !== id));
    } catch (err: any) {
      console.error('Error deleting mandub:', err);
      throw err;
    }
  };

  const assignMandubToRoom = (roomId: number, mandubId: number) => {
    // Remove any existing assignment for this room
    const updatedAssignments = centerAssignments.filter(assignment => assignment.roomId !== roomId);
    setCenterAssignments([...updatedAssignments, { roomId, mandubId }]);
  };

  const unassignMandubFromRoom = (roomId: number) => {
    setCenterAssignments(centerAssignments.filter(assignment => assignment.roomId !== roomId));
  };

  const getCenterStatistics = () => {
    const totalCenters = pollingBoxes.length;
    const fullCenters = centerAssignments.length;
    const emptyCenters = totalCenters - fullCenters;
    return {
      totalCenters,
      fullCenters,
      emptyCenters,
    };
  };

  // Cars operations
  const addCar = async (car: Omit<Car, 'id'>) => {
    try {
      const response = await carsAPI.create(car);
      setCars([...cars, response.data]);
    } catch (err: any) {
      console.error('Error adding car:', err);
      throw err;
    }
  };

  const updateCar = async (id: number, updates: Partial<Car>) => {
    try {
      const response = await carsAPI.update(id, updates);
      setCars(cars.map(car => 
        car.id === id ? response.data : car
      ));
    } catch (err: any) {
      console.error('Error updating car:', err);
      throw err;
    }
  };

  const deleteCar = async (id: number) => {
    try {
      await carsAPI.delete(id);
      setCars(cars.filter(car => car.id !== id));
    } catch (err: any) {
      console.error('Error deleting car:', err);
      throw err;
    }
  };

  return (
    <ElectionContext.Provider value={{
      partyLists,
      pollingBoxes,
      boxVotes,
      voters,
      mandubs,
      centerAssignments,
      cars,
      loading,
      error,
      addPartyList,
      updatePartyList,
      deletePartyList,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      addBoxVotes,
      getBoxVotes,
      updateBoxStatus,
      getBlockStatistics,
      updateVoterStatus,
      updateVoterStatusColor,
      getVotingStatistics,
      addMandub,
      updateMandub,
      deleteMandub,
      assignMandubToRoom,
      unassignMandubFromRoom,
      getCenterStatistics,
      addCar,
      updateCar,
      deleteCar,
      refreshData,
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (context === undefined) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}
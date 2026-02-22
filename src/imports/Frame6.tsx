import img2011 from "figma:asset/bdf828901c50b0e686755415de7adf1c3d09795f.png";

function Group() {
  return (
    <div className="absolute contents left-[58px] top-[641px]">
      <div className="absolute bg-black h-[65px] left-[58px] rounded-[50px] top-[641px] w-[278px]" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Cairo:Regular',sans-serif] font-normal h-[63px] justify-center leading-[0] left-[197px] not-italic text-[20px] text-center text-white top-[672.5px] w-[270px]">
        <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
          تسجيل دخول
        </p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[31px] top-[410px]">
      <div className="absolute bg-white border border-black border-solid h-[43px] left-[31px] rounded-[10px] top-[457px] w-[331px]" />
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Cairo:Regular',sans-serif] font-normal h-[37px] justify-center leading-[0] left-[352px] not-italic text-[20px] text-black text-right top-[428.5px] w-[258px]">
        <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
          الإسم
        </p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[32px] top-[516px]">
      <div className="absolute bg-white border border-black border-solid h-[43px] left-[32px] rounded-[10px] top-[563px] w-[331px]" />
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Cairo:Regular',sans-serif] font-normal h-[37px] justify-center leading-[0] left-[353px] not-italic text-[20px] text-black text-right top-[534.5px] w-[258px]">
        <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
          كلمة السر
        </p>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <Group />
      <Group1 />
      <Group2 />
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Cairo:Bold',sans-serif] font-bold h-[99px] justify-center leading-[0] left-[354px] not-italic text-[30px] text-black text-right top-[325.5px] w-[342px]">
        <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
          تطبيق ماكينة حجر وبشر
        </p>
      </div>
      <div className="absolute left-[65px] size-[264px] top-[27px]" data-name="لوغو مربع 2-01 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img2011} />
      </div>
    </div>
  );
}
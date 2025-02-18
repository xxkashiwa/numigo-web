'use client';

const Home = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mb-[10%] flex w-[44%] flex-col items-center justify-center gap-6 p-2">
        <h1 className="text-3xl font-extrabold">有什么可以帮忙的？</h1>
        <InputBox />
      </div>
    </div>
  );
};

const InputBox = () => {
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  return (
    <div className="flex w-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
      <div className="m-1 w-full">
        <textarea
          className="max-h-[200px] w-full resize-none border-none bg-inherit focus:outline-none focus:ring-0"
          placeholder="发送消息..."
          rows={1}
          onInput={handleTextareaInput}
        />
      </div>
      <div className="flex w-full justify-between pt-4">
        <div className="inline-flex gap-2">
          <AttachButton />
        </div>
        <div className="inline-flex gap-2">
          <ExpandButton />
          <EnterButton />
        </div>
      </div>
    </div>
  );
};

const AttachButton = () => {
  return (
    <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full"
      >
        <path d="M640-520v-200h80v200h-80ZM440-244q-35-10-57.5-39T360-350v-370h80v476Zm30 164q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v300h-80v-300q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q25 0 47.5-6.5T560-186v89q-21 8-43.5 12.5T470-80Zm170-40v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" />
      </svg>
    </button>
  );
};

const ExpandButton = () => {
  return (
    <button className="h-full w-8 rounded-xl bg-gray-600 bg-opacity-0 transition-all duration-300 hover:bg-opacity-30">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full"
      >
        <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
      </svg>
    </button>
  );
};

const EnterButton = () => {
  return (
    <button className="h-full w-9 rounded-3xl bg-black transition-all duration-300 hover:bg-opacity-60">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        className="h-full w-full fill-white"
      >
        <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z" />
      </svg>
    </button>
  );
};

export default Home;

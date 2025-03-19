'use client';

import InputBox from '@/components/inputbox';
import { Button } from '@/components/ui/button';
const Home = () => {
  return (
    <div className="flex h-[90vh] w-full">
      <Button
        className="fixed right-4 top-20 hidden"
        onClick={() => {
          window.location.href = '/chat';
        }}
      >
        chat page
      </Button>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 md:max-w-3xl">
          <h1 className="text-3xl font-extrabold">有什么可以帮忙的？</h1>
          <div className="w-full">
            <InputBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

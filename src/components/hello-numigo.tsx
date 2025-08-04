import Image from 'next/image';
const HelloNumigo = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <Image src="/logo-icon.png" alt="Logo" width={80} height={60} priority />
      <div className="flex flex-col">
        <p
          className="text-3xl font-bold"
          style={{
            color: 'rgba(2, 115, 255, 1)',
          }}
        >
          你好呀！我是Numigo！
        </p>
        <p
          style={{
            color: 'rgba(26, 26, 26, 0.6)',
          }}
        >
          我可以辅助你解决问题
        </p>
      </div>
    </div>
  );
};
export default HelloNumigo;

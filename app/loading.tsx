export default function loading() {
  return (
    <div className="fixed top-0 left-0 z-[99999] h-1 w-full overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-[loading_1.1s_ease-in-out_infinite] rounded-full bg-blue-600" />
    </div>
  );
}
import { WaveAnimation } from "@/components/WaveAnimation";


export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <WaveAnimation particleColor="#9433EB" />
    </main>
  )
}
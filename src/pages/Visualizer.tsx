import AudioVisualizer from '@/components/AudioVisualizer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Visualizer = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 pb-12">
        <AudioVisualizer />
      </main>
      <Footer />
    </div>
  );
};

export default Visualizer;

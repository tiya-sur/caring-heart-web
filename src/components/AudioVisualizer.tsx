import { useRef, useState, useCallback, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  const draw = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const render = () => {
      if (!isListening) return;
      
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'hsl(180, 35%, 8%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.3;
      const maxBarHeight = Math.min(centerX, centerY) * 0.5;
      const barCount = 64;
      const barWidth = 3;

      // Draw glow effect in center
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
      gradient.addColorStop(0, 'hsla(174, 72%, 56%, 0.15)');
      gradient.addColorStop(1, 'hsla(174, 72%, 56%, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw circular bars
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const frequencyIndex = Math.floor((i / barCount) * bufferLength * 0.5);
        const value = dataArray[frequencyIndex] || 0;
        const normalizedValue = value / 255;
        const barHeight = normalizedValue * maxBarHeight + 5;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const hue = 174 + (normalizedValue * 30);
        const lightness = 50 + (normalizedValue * 20);
        barGradient.addColorStop(0, `hsla(${hue}, 72%, ${lightness}%, 0.8)`);
        barGradient.addColorStop(1, `hsla(${hue + 20}, 80%, ${lightness + 10}%, 1)`);

        ctx.strokeStyle = barGradient;
        ctx.lineWidth = barWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Add glow effect for high values
        if (normalizedValue > 0.6) {
          ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.8)`;
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Draw inner circle
      ctx.strokeStyle = 'hsla(174, 72%, 56%, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw pulsing center based on average volume
      const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      const pulseRadius = radius * 0.6 + (average / 255) * radius * 0.3;
      
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      centerGradient.addColorStop(0, 'hsla(174, 72%, 56%, 0.4)');
      centerGradient.addColorStop(0.5, 'hsla(174, 72%, 46%, 0.2)');
      centerGradient.addColorStop(1, 'hsla(174, 72%, 36%, 0)');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    render();
  }, [isListening]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false 
        } 
      });
      
      streamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsListening(true);
      toast.success('Microphone connected');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'hsl(180, 35%, 8%)';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    toast.info('Microphone disconnected');
  };

  useEffect(() => {
    if (isListening) {
      draw();
    }
  }, [isListening, draw]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const size = Math.min(container.clientWidth, 500);
          canvasRef.current.width = size;
          canvasRef.current.height = size;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      stopListening();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Audio Visualizer
        </h2>
        <p className="text-muted-foreground">
          Click the button below to start visualizing audio from your microphone
        </p>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-full shadow-2xl"
          style={{
            background: 'hsl(180, 35%, 8%)',
            boxShadow: isListening 
              ? '0 0 60px hsla(174, 72%, 56%, 0.3), inset 0 0 30px hsla(174, 72%, 56%, 0.1)' 
              : '0 0 30px hsla(0, 0%, 0%, 0.3)'
          }}
        />
        
        {!isListening && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MicOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Microphone off</p>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={isListening ? stopListening : startListening}
        size="lg"
        className={`gap-2 px-8 transition-all duration-300 ${
          isListening 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Listening
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center max-w-md">
        This visualizer requires microphone access. Your audio is processed locally and is not recorded or transmitted.
      </p>
    </div>
  );
};

export default AudioVisualizer;

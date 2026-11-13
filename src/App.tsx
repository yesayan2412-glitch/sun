import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  nameRu: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitRadius: number; // pixels for display
  size: number; // pixels for display
  color: string;
  description: string;
}

const planets: Planet[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitRadius: 60,
    size: 6,
    color: '#b5b5b5',
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами.',
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitRadius: 90,
    size: 10,
    color: '#e8cda0',
    description: 'Самая горячая планета с плотной атмосферой из углекислого газа.',
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    orbitRadius: 125,
    size: 11,
    color: '#4da6ff',
    description: 'Наш дом! Единственная известная планета с жизнью и жидкой водой на поверхности.',
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitRadius: 160,
    size: 8,
    color: '#e07040',
    description: 'Красная планета с самой высокой горой в Солнечной системе — Олимп.',
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitRadius: 210,
    size: 24,
    color: '#d4a574',
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном.',
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitRadius: 270,
    size: 20,
    color: '#f0d890',
    description: 'Знаменита своими великолепными кольцами из льда и камней.',
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitRadius: 325,
    size: 15,
    color: '#7de8e8',
    description: 'Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°.',
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitRadius: 375,
    size: 14,
    color: '#4466ff',
    description: 'Самая далёкая планета с самыми сильными ветрами до 2100 км/ч.',
  },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setAngles((prev) =>
        prev.map((angle, i) => {
          const baseSpeed = (2 * Math.PI) / (planets[i].orbitalPeriod / 30);
          return angle + baseSpeed * delta * speed;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    },
    [speed]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, animate]);

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet);
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center overflow-hidden relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 text-center pt-4 pb-2">
        <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wide">
          ☀️ Интерактивная Солнечная Система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для получения информации</p>
      </header>

      {/* Solar System Container */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full max-w-[800px] max-h-[800px] flex items-center justify-center"
        style={{ aspectRatio: '1/1' }}
      >
        {/* Sun */}
        <div
          className="absolute rounded-full z-10 cursor-pointer"
          style={{
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, #fff700, #ff8c00, #ff4500)',
            boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 69, 0, 0.3)',
          }}
          onClick={() => setSelectedPlanet(null)}
        />

        {/* Orbits and Planets */}
        {planets.map((planet, index) => (
          <div key={planet.name}>
            {/* Orbit */}
            <div
              className="absolute rounded-full border border-gray-700/40"
              style={{
                width: planet.orbitRadius * 2 + 'px',
                height: planet.orbitRadius * 2 + 'px',
                top: `calc(50% - ${planet.orbitRadius}px)`,
                left: `calc(50% - ${planet.orbitRadius}px)`,
              }}
            />
            {/* Planet */}
            <div
              className="absolute cursor-pointer transition-transform hover:scale-150 z-20"
              style={{
                width: planet.size + 'px',
                height: planet.size + 'px',
                top: `calc(50% - ${planet.size / 2}px)`,
                left: `calc(50% - ${planet.size / 2}px)`,
                transform: `rotate(${angles[index]}rad) translateX(${planet.orbitRadius}px)`,
                transformOrigin: 'center center',
              }}
              onClick={() => handlePlanetClick(planet)}
              title={planet.nameRu}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  backgroundColor: planet.color,
                  boxShadow: `0 0 ${planet.size / 2}px ${planet.color}80`,
                }}
              />
              {/* Planet label */}
              <div
                className="absolute text-[9px] text-gray-300 whitespace-nowrap pointer-events-none"
                style={{
                  top: planet.size + 2 + 'px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(-${angles[index]}rad)`,
                }}
              >
                {planet.nameRu}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 md:right-8 z-30 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-5 max-w-xs shadow-2xl">
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg"
            onClick={() => setSelectedPlanet(null)}
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="rounded-full"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: selectedPlanet.color,
                boxShadow: `0 0 12px ${selectedPlanet.color}80`,
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
              <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">{selectedPlanet.description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">📏 Диаметр:</span>
              <span className="text-white font-medium">{selectedPlanet.diameter.toLocaleString()} км</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">🌍 Расстояние от Солнца:</span>
              <span className="text-white font-medium">{selectedPlanet.distanceFromSun} млн км</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">🔄 Орбитальный период:</span>
              <span className="text-white font-medium">
                {selectedPlanet.orbitalPeriod >= 365
                  ? `${(selectedPlanet.orbitalPeriod / 365.25).toFixed(1)} лет`
                  : `${selectedPlanet.orbitalPeriod} дней`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 w-full max-w-2xl px-4 py-4">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex flex-wrap items-center justify-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            {isPlaying ? (
              <>
                <span className="text-lg">⏸</span> Пауза
              </>
            ) : (
              <>
                <span className="text-lg">▶️</span> Воспроизведение
              </>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Скорость:</span>
            <div className="flex gap-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    speed === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => setAngles(planets.map(() => Math.random() * Math.PI * 2))}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
          >
            🔀 Сбросить
          </button>
        </div>
      </div>

      {/* Planet Legend */}
      <div className="relative z-10 pb-4 px-4 w-full max-w-4xl">
        <div className="flex flex-wrap justify-center gap-3">
          {planets.map((planet) => (
            <button
              key={planet.name}
              onClick={() => handlePlanetClick(planet)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${
                selectedPlanet?.name === planet.name
                  ? 'bg-gray-700 ring-1 ring-blue-500'
                  : 'hover:bg-gray-800'
              }`}
            >
              <div
                className="rounded-full"
                style={{
                  width: Math.max(8, planet.size * 0.6) + 'px',
                  height: Math.max(8, planet.size * 0.6) + 'px',
                  backgroundColor: planet.color,
                }}
              />
              <span className="text-xs text-gray-300">{planet.nameRu}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CSS Animation for stars */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

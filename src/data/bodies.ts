// Real solar-system data. Orbital elements are J2000.0 heliocentric mean
// elements (epoch 2000-01-01 12:00 TT). Sources: NASA JPL planetary fact
// sheets and the IAU/JPL keplerian element tables (Standish 1992 / E.M.
// Standish "Keplerian Elements for Approximate Positions of the Major
// Planets"). Values are intentionally kept in their natural physical units;
// the renderer converts to scene units, never the data.

export interface OrbitalElements {
  /** Semi-major axis (AU). */
  a: number;
  /** Eccentricity (dimensionless). */
  e: number;
  /** Inclination to the ecliptic (degrees). */
  i: number;
  /** Longitude of the ascending node Ω (degrees). */
  node: number;
  /** Longitude of perihelion ϖ = Ω + ω (degrees). */
  peri: number;
  /** Mean longitude L at J2000 (degrees). */
  meanLongitude: number;
}

export interface Moon {
  id: string;
  name: string;
  /** Mass, kg. */
  mass: number;
  /** Mean radius, km. */
  radius: number;
  /** Semi-major axis of the orbit around the planet, km. */
  aKm: number;
  /** Eccentricity. */
  e: number;
  /** Inclination to the ecliptic (degrees). >90° = retrograde. */
  i: number;
  /** Starting phase / mean longitude (degrees) — only sets where it begins. */
  phase: number;
  /** Sidereal rotation period (days); most large moons are tidally locked. */
  rotationPeriod: number;
  color: number;
  /**
   * Whether this moon is fed into the N-body integrator. Only set for moons
   * massive enough to visibly perturb their planet (e.g. the Moon, Charon);
   * negligible moons (Phobos ~10⁻⁸ of Mars) are render-only to save compute.
   */
  simulateGravity: boolean;
  note?: string;
}

export interface Body {
  id: string;
  name: string;
  /** Mass, kg. */
  mass: number;
  /** Mean (volumetric) radius, km. */
  radius: number;
  /** Axial tilt / obliquity to its orbit (degrees). */
  axialTilt: number;
  /** Sidereal rotation period (days). Negative = retrograde. */
  rotationPeriod: number;
  /** sRGB display color. */
  color: number;
  /** Heliocentric J2000 orbital elements. The Sun has none. */
  orbit?: OrbitalElements;
  /** Natural satellites. */
  moons?: Moon[];
  /** Optional descriptive note shown in the info panel. */
  note?: string;
}

// The Sun sits at the origin / barycenter for the Keplerian model.
export const SUN: Body = {
  id: 'sun',
  name: '太阳',
  mass: 1.98892e30,
  radius: 696340,
  axialTilt: 7.25,
  rotationPeriod: 25.38, // sidereal, at the equator
  color: 0xffd24a,
  note: 'G型主序星 (G2V)。包含系统质量的 99.86%。',
};

export const PLANETS: Body[] = [
  {
    id: 'mercury',
    name: '水星',
    mass: 3.3011e23,
    radius: 2439.7,
    axialTilt: 0.034,
    rotationPeriod: 58.646,
    color: 0x9c8b7d,
    orbit: { a: 0.38709927, e: 0.20563593, i: 7.00497902, node: 48.33076593, peri: 77.45779628, meanLongitude: 252.25032350 },
    note: '最小的行星；没有实质性大气层；3:2 自旋轨道共振。',
  },
  {
    id: 'venus',
    name: '金星',
    mass: 4.8675e24,
    radius: 6051.8,
    axialTilt: 177.36, // near-complete flip -> retrograde rotation
    rotationPeriod: -243.025,
    color: 0xe8cda2,
    orbit: { a: 0.72333566, e: 0.00677672, i: 3.39467605, node: 76.67984255, peri: 131.60246718, meanLongitude: 181.97909950 },
    note: '由于失控的二氧化碳温室效应，是最热的行星（约 464 °C）。逆行自转。',
  },
  {
    id: 'earth',
    name: '地球',
    mass: 5.97237e24,
    radius: 6371.0,
    axialTilt: 23.44,
    rotationPeriod: 0.99726968,
    color: 0x3b7dd8,
    orbit: { a: 1.00000261, e: 0.01671123, i: -0.00001531, node: 0.0, peri: 102.93768193, meanLongitude: 100.46457166 },
    note: '已知唯一孕育生命的星球；1 天文单位 (AU) 距离单位的基准。',
    moons: [
      {
        id: 'moon', name: '月球', mass: 7.342e22, radius: 1737.4,
        aKm: 384400, e: 0.0549, i: 5.145, phase: 0, rotationPeriod: 27.3217,
        color: 0xbcbcbc, simulateGravity: true,
        note: '质量是地球的 1.2% —— 足以使两个天体绕着距离地心 4671 公里的质心运行。',
      },
    ],
  },
  {
    id: 'mars',
    name: '火星',
    mass: 6.4171e23,
    radius: 3389.5,
    axialTilt: 25.19,
    rotationPeriod: 1.025957,
    color: 0xc1440e,
    orbit: { a: 1.52371034, e: 0.09339410, i: 1.84969142, node: 49.55953891, peri: -23.94362959, meanLongitude: -4.55343205 },
    note: '“红色星球”；拥有系统中最高的火山——奥林匹斯山。',
    moons: [
      { id: 'phobos', name: '火卫一', mass: 1.0659e16, radius: 11.27, aKm: 9376, e: 0.0151, i: 1.093, phase: 0, rotationPeriod: 0.31891, color: 0x8a7a6a, simulateGravity: false, note: '极小（约为火星质量的 10⁻⁸）：引力影响可忽略不计，仅用于渲染。' },
      { id: 'deimos', name: '火卫二', mass: 1.4762e15, radius: 6.2, aKm: 23463, e: 0.00033, i: 0.93, phase: 130, rotationPeriod: 1.2624, color: 0x8a7a6a, simulateGravity: false },
    ],
  },
  {
    id: 'jupiter',
    name: '木星',
    mass: 1.8982e27,
    radius: 69911,
    axialTilt: 3.13,
    rotationPeriod: 0.41354,
    color: 0xd8a878,
    orbit: { a: 5.20288700, e: 0.04838624, i: 1.30439695, node: 100.47390909, peri: 14.72847983, meanLongitude: 34.39644051 },
    note: '质量最大的行星（是其他所有行星总和的 2.5 倍）。大红斑是一个巨大的风暴。',
    moons: [
      { id: 'io', name: '木卫一', mass: 8.9319e22, radius: 1821.6, aKm: 421700, e: 0.0041, i: 0.05, phase: 0, rotationPeriod: 1.769, color: 0xd9cf6a, simulateGravity: true, note: '系统中火山活动最活跃的天体。' },
      { id: 'europa', name: '木卫二', mass: 4.7998e22, radius: 1560.8, aKm: 671034, e: 0.009, i: 0.47, phase: 60, rotationPeriod: 3.551, color: 0xcab98f, simulateGravity: true, note: '冰壳下隐藏着地下海洋。' },
      { id: 'ganymede', name: '木卫三', mass: 1.4819e23, radius: 2634.1, aKm: 1070412, e: 0.0013, i: 0.20, phase: 150, rotationPeriod: 7.155, color: 0x9c8e7a, simulateGravity: true, note: '太阳系中最大的卫星 —— 比水星还大。' },
      { id: 'callisto', name: '木卫四', mass: 1.0759e23, radius: 2410.3, aKm: 1882709, e: 0.0074, i: 0.192, phase: 250, rotationPeriod: 16.689, color: 0x6e655a, simulateGravity: true },
    ],
  },
  {
    id: 'saturn',
    name: '土星',
    mass: 5.6834e26,
    radius: 58232,
    axialTilt: 26.73,
    rotationPeriod: 0.44401,
    color: 0xe3c98f,
    orbit: { a: 9.53667594, e: 0.05386179, i: 2.48599187, node: 113.66242448, peri: 92.59887831, meanLongitude: 49.95424423 },
    note: '著名的冰石环系统；平均密度在所有行星中最低（小于水）。',
    moons: [
      { id: 'titan', name: '土卫六', mass: 1.3452e23, radius: 2574.7, aKm: 1221870, e: 0.0288, i: 0.34854, phase: 0, rotationPeriod: 15.945, color: 0xd8a14a, simulateGravity: true, note: '厚重的氮气大气层；有液态甲烷湖泊。' },
      { id: 'rhea', name: '土卫五', mass: 2.307e21, radius: 763.8, aKm: 527108, e: 0.0012, i: 0.345, phase: 200, rotationPeriod: 4.518, color: 0xb9b3a8, simulateGravity: false },
    ],
  },
  {
    id: 'uranus',
    name: '天王星',
    mass: 8.6810e25,
    radius: 25362,
    axialTilt: 97.77, // rolls on its side
    rotationPeriod: -0.71833,
    color: 0x9fe0e6,
    orbit: { a: 19.18916464, e: 0.04725744, i: 0.77263783, node: 74.01692503, peri: 170.95427630, meanLongitude: 313.23810451 },
    note: '倾斜 98° 的冰巨星，实际上是在侧向绕轨道运行。逆行自转。',
    moons: [
      { id: 'titania', name: '天卫三', mass: 3.4e21, radius: 788.4, aKm: 435910, e: 0.0011, i: 0.34, phase: 0, rotationPeriod: 8.706, color: 0xa9b6b6, simulateGravity: false },
      { id: 'oberon', name: '天卫四', mass: 3.076e21, radius: 761.4, aKm: 583520, e: 0.0014, i: 0.058, phase: 180, rotationPeriod: 13.46, color: 0x97a3a3, simulateGravity: false },
    ],
  },
  {
    id: 'neptune',
    name: '海王星',
    mass: 1.02413e26,
    radius: 24622,
    axialTilt: 28.32,
    rotationPeriod: 0.6713,
    color: 0x3b5bdb,
    orbit: { a: 30.06992276, e: 0.00859048, i: 1.77004347, node: 131.78422574, peri: 44.96476227, meanLongitude: -55.12002969 },
    note: '风力最大的行星（>2000 公里/小时）。1846 年通过数学预测被发现。',
    moons: [
      { id: 'triton', name: '海卫一', mass: 2.139e22, radius: 1353.4, aKm: 354759, e: 0.000016, i: 156.885, phase: 0, rotationPeriod: -5.877, color: 0xc9c2d0, simulateGravity: true, note: '逆行轨道 —— 可能是被捕获的柯伊伯带天体。' },
    ],
  },
  {
    id: 'pluto',
    name: '冥王星',
    mass: 1.303e22,
    radius: 1188.3,
    axialTilt: 122.53,
    rotationPeriod: -6.387,
    color: 0xcdb89a,
    orbit: { a: 39.48211675, e: 0.24882730, i: 17.14001206, node: 110.30393684, peri: 224.06891629, meanLongitude: 238.92903833 },
    note: '轨道高度偏心且倾斜的矮行星；2006 年由国际天文学联合会重新分类。',
    moons: [
      { id: 'charon', name: '冥卫一', mass: 1.586e21, radius: 606, aKm: 19591, e: 0.0002, i: 0.08, phase: 0, rotationPeriod: 6.387, color: 0x9c948a, simulateGravity: true, note: '直径是冥王星的一半，质量是其 12% —— 质心位于它们之间的开放空间，使其成为真正的双星系统。' },
    ],
  },
];

export const ALL_BODIES: Body[] = [SUN, ...PLANETS];

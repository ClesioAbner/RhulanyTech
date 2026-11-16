const INK = '#0C0C0D';
const PAPER = '#FFFFFF';

const Tire = () => (
  <svg viewBox="0 0 30 30" aria-hidden="true">
    <circle r="13.5" cy="15" cx="15" fill={INK} stroke={INK} strokeWidth="3" />
    <circle r="6" cy="15" cx="15" fill="#E8E8ED" />
  </svg>
);

/*
 * The van on its way: it bobs on its suspension while the road, its markings and a street lamp
 * slide past. Drawn in the shop's colours, with the name on the cargo box. Styles in index.css.
 * `size` is the font size it is drawn at: 10px makes it 220 × 100 px.
 */
const DeliveryTruck = ({ size = '10px' }: { size?: string }) => (
  <div className="rt-truck" style={{ fontSize: size }} aria-hidden="true">
    <div className="rt-truck-body">
      <svg viewBox="0 0 198 93" className="w-full font-display">
        {/* Cab */}
        <path
          d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
          fill={INK}
          stroke={INK}
          strokeWidth="3"
        />
        {/* Window */}
        <path
          d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
          fill="#C9D3E3"
          stroke={INK}
          strokeWidth="3"
        />
        {/* Door handle, headlight and bumper */}
        <rect x="143" y="63" width="8" height="3" rx="1.5" fill="#E8E8ED" />
        <rect x="186" y="63" width="6" height="7" rx="1" fill="#FFE3A3" stroke={INK} strokeWidth="2" />
        <rect x="192" y="81" width="5" height="11" rx="1" fill={INK} />
        {/* Cargo box with the name on its side */}
        <rect x="6.5" y="1.5" width="121" height="90" rx="6" fill={PAPER} stroke={INK} strokeWidth="3" />
        <text x="67" y="52" textAnchor="middle" fontSize="19" fontWeight="600" letterSpacing="-0.4" fill={INK}>
          Rhulany<tspan fill="#9A9AA0">Tech</tspan>
        </text>
        <rect x="1" y="84" width="6" height="4" rx="2" fill={PAPER} stroke={INK} strokeWidth="2" />
      </svg>
    </div>
    <div className="rt-truck-tires">
      <Tire />
      <Tire />
    </div>
    <div className="rt-truck-road" />
    <svg viewBox="0 0 453.459 453.459" className="rt-truck-lamp" fill="currentColor">
      <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0zM232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017h78.747C231.693,100.736,232.77,106.162,232.77,111.694z" />
    </svg>
  </div>
);

export default DeliveryTruck;

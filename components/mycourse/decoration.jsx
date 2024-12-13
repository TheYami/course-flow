export default function Decoration() {
  return (
    <div className="decoaration relative w-full z-[-10]">
      <svg
        width="100%"
        height="350"
        viewBox="0 0 375 157"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-5 left-0 xl:hidden"
      >
        <circle cx="350" cy="170" r="37" fill="#C6DCFF" />
        <path
          d="M320.372 35.5449L338.99 32.7062L332.139 50.249L320.372 35.5449Z"
          stroke="#FBAA1C"
          strokeWidth="3"
        />
        <circle cx="58" cy="-89" r="5.5" stroke="#2F5FAC" strokeWidth="3" />
        <circle cx="0.253627" cy="-20" r="13" fill="#C6DCFF" />
      </svg>

      <svg
        width="100%"
        height="500"
        viewBox="0 0 1980 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-5 left-0 hidden xl:block"
      >
        <circle cx="1965" cy="90" r="37" fill="#C6DCFF" />
        <g className="triangle" transform="scale(1.4) translate(950,-40)">
          <path
            d="M320.372 35.5449L338.99 32.7062L332.139 50.249L320.372 35.5449Z"
            stroke="#FBAA1C"
            strokeWidth="3"
          />
        </g>
        <circle cx="130" cy="-50" r="5.5" stroke="#2F5FAC" strokeWidth="3" />
        <circle cx="70" cy="20" r="13" fill="#C6DCFF" />

        <g className="green-x" transform="scale(1.4) translate(30,-80)">
          <path
            d="M248.843 132L243.838 150.68"
            stroke="#2FAC61"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M237 138.838L255.68 143.843"
            stroke="#2FAC61"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default function PaymentDecoration() {
    return (
      <div className="decoaration relative w-full z-[-10]">
  
        <svg
          width="100%"
          height="500"
          viewBox="0 0 1980 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-5 left-0 hidden xl:block"
        >
          <circle cx="1965" cy="180" r="50" fill="#C6DCFF" />
          <g className="triangle" transform="scale(1.5) translate(850,0)">
            <path
              d="M320.372 35.5449L338.99 32.7062L332.139 50.249L320.372 35.5449Z"
              stroke="#FBAA1C"
              strokeWidth="3"
            />
          </g>
          <circle cx="130" cy="-15" r="6" stroke="#2F5FAC" strokeWidth="3" />
          <circle cx="70" cy="70" r="20" fill="#C6DCFF" />
  
          <g className="green-x" transform="scale(1.5) translate(20,-50)">
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
  
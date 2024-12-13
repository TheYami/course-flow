import { useRouter } from "next/router";

export default function BackBotton({url}) {
  const router = useRouter()
    return (
    <div className="back-button">
      <button
        className="back-to-course flex items-center gap-2 w-fit"
        onClick={() => router.push(url)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5273 7.33641H5.08066L8.334 4.08307C8.594 3.82307 8.594 3.39641 8.334 3.13641C8.074 2.87641 7.654 2.87641 7.394 3.13641L3.00066 7.52974C2.74066 7.78974 2.74066 8.20974 3.00066 8.46974L7.394 12.8631C7.654 13.1231 8.074 13.1231 8.334 12.8631C8.594 12.6031 8.594 12.1831 8.334 11.9231L5.08066 8.66974H12.5273C12.894 8.66974 13.194 8.36974 13.194 8.00307C13.194 7.63641 12.894 7.33641 12.5273 7.33641Z"
            fill="#2F5FAC"
          />
        </svg>
        <p className="font-bold text-base text-[#2F5FAC]  mb-0">Back</p>
      </button>
    </div>
  );
}

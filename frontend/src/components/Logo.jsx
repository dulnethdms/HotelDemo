export default function Logo({ light = true, size = 40 }) {
  return (
    <span className={`logo ${light ? 'logo--light' : 'logo--dark'}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="24" r="10" fill="#c9a35b" />
        <path d="M6 40c6-5 10-5 16 0s10 5 16 0 10-5 16 0" fill="none" stroke="#6fd0cf" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M6 51c6-5 10-5 16 0s10 5 16 0 10-5 16 0" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity=".75" />
      </svg>
      <span className="logo__text">
        <strong>Ocean Paradise</strong>
        <small>Resort</small>
      </span>
    </span>
  );
}

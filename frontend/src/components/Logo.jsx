export default function Logo({ light = true, size = 40 }) {
  return (
    <span className={`logo ${light ? 'logo--light' : 'logo--dark'}`}>
      
      <span className="logo__text">
        <strong>Mora Mila</strong>
        <small>Hotel</small>
      </span>
    </span>
  );
}

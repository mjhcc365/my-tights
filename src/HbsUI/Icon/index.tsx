interface IconProps {
  icon: string;
  fontSize?: number;
  color?: string;
}
const Icon = (props: IconProps) => {
  const { icon, fontSize = 16, color = "#000" } = props;
  return (
    <svg style={{ fontSize, color }} className="icon" aria-hidden="true">
      <use xlinkHref={`#icon-${icon}`}></use>
    </svg>
  );
};

export default Icon;

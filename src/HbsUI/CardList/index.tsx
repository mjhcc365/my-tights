export interface CardListProps {
  column: "2" | "3";
  title: string;
  data: any[];
  onClickAll: () => void;
  onClickAdd: () => void;
}

const mockData = [
  {
    img: "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712698396006-1996dc7cb2cc",
    json: {},
  },
  {
    img: "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712081024194-bd8d6af8fd68",
    json: {},
  },
  {
    img: "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1711997632197-e09b5c59605d",
    json: {},
  },
];

export const CardList = (props: CardListProps) => {
  const { data = [], column, title } = props;
  return (
    <section>
      <div className="flex justify-between">
        <span>{title}</span>
        <span style={{ cursor: "pointer", color: "#555" }}>查看更多</span>
      </div>
      <div className="grid gap-1 grid-cols-2">
        {mockData.map((item) => {
          return (
            <div className="flex">
              <img src={item.img} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

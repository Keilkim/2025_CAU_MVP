// app/lib/data.ts

export type CategoryKey = "insects" | "reptiles";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: CategoryKey;
  isBest?: boolean;
};

export type Category = {
  key: CategoryKey;
  label: string;
  labelEn: string;
  cover: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    key: "insects",
    label: "곤충",
    labelEn: "INSECTS",
    cover: "/covers/insects.jpeg",
    description: "사슴벌레, 장수풍뎅이 등 곤충 사육용품",
  },
  {
    key: "reptiles",
    label: "파충류",
    labelEn: "REPTILES",
    cover: "/covers/reptiles.jpeg",
    description: "도마뱀, 뱀, 거북이 등 파충류 사육용품",
  },
];

export const PRODUCTS: Product[] = [
  // 곤충 (5개)
  {
    id: "i1",
    name: "사슴벌레 사육케이스",
    price: 25000,
    description: "통풍이 잘 되는 사육케이스입니다. 사슴벌레, 장수풍뎅이 사육에 적합합니다.",
    image: "/products/insects/cage.jpeg",
    category: "insects",
    isBest: true,
  },
  {
    id: "i2",
    name: "곤충 젤리 30개입",
    price: 8000,
    description: "사슴벌레, 장수풍뎅이용 고단백 젤리입니다.",
    image: "/products/insects/jelly.jpeg",
    category: "insects",
  },
  {
    id: "i3",
    name: "발효톱밥 5L",
    price: 12000,
    description: "유충 사육용 발효톱밥입니다. 영양분이 풍부합니다.",
    image: "/products/insects/sawdust.jpeg",
    category: "insects",
  },
  {
    id: "i4",
    name: "참나무 은신처",
    price: 5000,
    description: "천연 참나무로 만든 은신처입니다.",
    image: "/products/insects/hide.jpeg",
    category: "insects",
  },
  {
    id: "i5",
    name: "젤리 홀더 5개입",
    price: 3000,
    description: "젤리가 뒤집어지지 않게 고정해주는 홀더입니다.",
    image: "/products/insects/holder.jpeg",
    category: "insects",
  },

  // 파충류 (5개)
  {
    id: "r1",
    name: "레오파드게코 테라리움",
    price: 89000,
    description: "레오파드게코 사육에 최적화된 유리 테라리움입니다. 45x30x30cm",
    image: "/products/reptiles/terrarium.jpeg",
    category: "reptiles",
    isBest: true,
  },
  {
    id: "r2",
    name: "밀웜 100g",
    price: 5000,
    description: "레오파드게코, 도마뱀류의 주식인 밀웜입니다.",
    image: "/products/reptiles/mealworm.jpeg",
    category: "reptiles",
  },
  {
    id: "r3",
    name: "히팅 패드",
    price: 15000,
    description: "테라리움 바닥에 부착하는 온열 패드입니다.",
    image: "/products/reptiles/heatpad.jpeg",
    category: "reptiles",
  },
  {
    id: "r4",
    name: "은신 동굴",
    price: 12000,
    description: "파충류가 숨을 수 있는 은신처입니다.",
    image: "/products/reptiles/hide.jpeg",
    category: "reptiles",
  },
  {
    id: "r5",
    name: "온도/습도계",
    price: 8000,
    description: "테라리움 내부 온도와 습도를 확인할 수 있는 디지털 온습도계입니다.",
    image: "/products/reptiles/thermometer.jpeg",
    category: "reptiles",
  },
];

// 유틸리티 함수
export function getProductsByCategory(category: CategoryKey): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getBestProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isBest);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

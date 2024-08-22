export type ImgCardProps = {
  title: string;
  place: string;
  bgImageSrc: string;
  logoSrc: string;
  name: string;
  email: string;
  phone: string;
  uniqueCode: string;
  customerId: number;
  cardLink: string;
  listTitle: string;
  onClick?: () => void;
};

export type InfoCountCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  cardLink: string;
  color: string;
  blueBg: boolean;
  greenBg: boolean;
  onClick?: () => void;
};

export type IconListItemsProps = {
  email: string;
  phone: number;
  website: string;
  address: string;
  gst: string;
  schoolcode: string;
  username: string;
  dob: string;
  id: number;
  listTitle: string;
  contactPerson: string;
};

export type CardHeadProps = {
  title: string;
  description: string;
  image: string;
  btnLink: string;
  btnName: string;
};

export type WelcomeCardProps = {
  title: string;
  role: string;
  description: string;
  imageUrl: string;
  cardLink: string;
};

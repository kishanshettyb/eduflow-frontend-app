export type MenuItem = {
  id: string;
  label: string;
  icon: IconDefinition;
  path: string;
  actions: string[];
  subMenu?: MenuItem[];
};

export type PolicyRule = {
  resource: string;
  actions: string[];
  subject: string;
};

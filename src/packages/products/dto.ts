export type ProductCreateDto = {
    name: string;
    shortDescription: string;
    image: string;
    description: string;
    certificate: string;
    categoryId: number;
    price?: number;
};

export type ProductUpdateDto = {
    name?: string;
    shortDescription?: string;
    image?: string;
    description?: string;
    certificate?: string;
    categoryId?: number;
    price?: number;
};

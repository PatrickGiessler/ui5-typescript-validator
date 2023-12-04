import { QNumberV2Path, QStringV2Path, QDateTimeV2Path, QStringNumberV2Path, QEntityPath, QId, QNumberParam, QEntityCollectionPath, QueryObject, QFunction, OperationReturnType, ReturnTypes, QComplexParam } from "@odata2ts/odata-query-objects";
export class QProduct extends QueryObject {
    ID = new QNumberV2Path(this.withPrefix("ID"));
    Name = new QStringV2Path(this.withPrefix("Name"));
    Description = new QStringV2Path(this.withPrefix("Description"));
    ReleaseDate = new QDateTimeV2Path(this.withPrefix("ReleaseDate"));
    DiscontinuedDate = new QDateTimeV2Path(this.withPrefix("DiscontinuedDate"));
    Rating = new QNumberV2Path(this.withPrefix("Rating"));
    Price = new QStringNumberV2Path(this.withPrefix("Price"));
    Category = new QEntityPath(this.withPrefix("Category"), () => QCategory);
    Supplier = new QEntityPath(this.withPrefix("Supplier"), () => QSupplier);
}
export const qProduct = new QProduct();
export class QProductId extends QId {
    params = [new QNumberParam("ID")];
    getParams() {
        return this.params;
    }
}
export class QCategory extends QueryObject {
    ID = new QNumberV2Path(this.withPrefix("ID"));
    Name = new QStringV2Path(this.withPrefix("Name"));
    Products = new QEntityCollectionPath(this.withPrefix("Products"), () => QProduct);
}
export const qCategory = new QCategory();
export class QCategoryId extends QId {
    params = [new QNumberParam("ID")];
    getParams() {
        return this.params;
    }
}
export class QSupplier extends QueryObject {
    ID = new QNumberV2Path(this.withPrefix("ID"));
    Name = new QStringV2Path(this.withPrefix("Name"));
    Address = new QEntityPath(this.withPrefix("Address"), () => QAddress);
    Concurrency = new QNumberV2Path(this.withPrefix("Concurrency"));
    Products = new QEntityCollectionPath(this.withPrefix("Products"), () => QProduct);
}
export const qSupplier = new QSupplier();
export class QSupplierId extends QId {
    params = [new QNumberParam("ID")];
    getParams() {
        return this.params;
    }
}
export class QAddress extends QueryObject {
    Street = new QStringV2Path(this.withPrefix("Street"));
    City = new QStringV2Path(this.withPrefix("City"));
    State = new QStringV2Path(this.withPrefix("State"));
    ZipCode = new QStringV2Path(this.withPrefix("ZipCode"));
    Country = new QStringV2Path(this.withPrefix("Country"));
}
export const qAddress = new QAddress();
export class QGetProductsByRating extends QFunction {
    params = [new QNumberParam("rating")];
    constructor() {
        super("GetProductsByRating", new OperationReturnType(ReturnTypes.COMPLEX_COLLECTION, new QComplexParam("NONE", new QProduct)), { v2Mode: true });
    }
    getParams() {
        return this.params;
    }
}

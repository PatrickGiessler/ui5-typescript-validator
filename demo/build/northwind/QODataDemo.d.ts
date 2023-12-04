import { QNumberV2Path, QStringV2Path, QDateTimeV2Path, QStringNumberV2Path, QEntityPath, QId, QNumberParam, QEntityCollectionPath, QueryObject, QFunction } from "@odata2ts/odata-query-objects";
import { ProductId, CategoryId, SupplierId, GetProductsByRatingParams } from "./ODataDemoModel";
export declare class QProduct extends QueryObject {
    readonly ID: QNumberV2Path<number>;
    readonly Name: QStringV2Path<string>;
    readonly Description: QStringV2Path<string>;
    readonly ReleaseDate: QDateTimeV2Path<string>;
    readonly DiscontinuedDate: QDateTimeV2Path<string>;
    readonly Rating: QNumberV2Path<number>;
    readonly Price: QStringNumberV2Path<string>;
    readonly Category: QEntityPath<QCategory>;
    readonly Supplier: QEntityPath<QSupplier>;
}
export declare const qProduct: QProduct;
export declare class QProductId extends QId<ProductId> {
    private readonly params;
    getParams(): QNumberParam<number>[];
}
export declare class QCategory extends QueryObject {
    readonly ID: QNumberV2Path<number>;
    readonly Name: QStringV2Path<string>;
    readonly Products: QEntityCollectionPath<QProduct>;
}
export declare const qCategory: QCategory;
export declare class QCategoryId extends QId<CategoryId> {
    private readonly params;
    getParams(): QNumberParam<number>[];
}
export declare class QSupplier extends QueryObject {
    readonly ID: QNumberV2Path<number>;
    readonly Name: QStringV2Path<string>;
    readonly Address: QEntityPath<QAddress>;
    readonly Concurrency: QNumberV2Path<number>;
    readonly Products: QEntityCollectionPath<QProduct>;
}
export declare const qSupplier: QSupplier;
export declare class QSupplierId extends QId<SupplierId> {
    private readonly params;
    getParams(): QNumberParam<number>[];
}
export declare class QAddress extends QueryObject {
    readonly Street: QStringV2Path<string>;
    readonly City: QStringV2Path<string>;
    readonly State: QStringV2Path<string>;
    readonly ZipCode: QStringV2Path<string>;
    readonly Country: QStringV2Path<string>;
}
export declare const qAddress: QAddress;
export declare class QGetProductsByRating extends QFunction<GetProductsByRatingParams> {
    private readonly params;
    constructor();
    getParams(): QNumberParam<number>[];
}

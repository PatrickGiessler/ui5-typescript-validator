import { ODataCollectionResponseV2 } from "@odata2ts/odata-core";
import { ODataHttpClient, ODataHttpClientConfig, ODataResponse } from "@odata2ts/http-client-api";
import { ODataService, EntityTypeServiceV2, EntitySetServiceV2 } from "@odata2ts/odata-service";
import { ProductId, CategoryId, SupplierId, Product, GetProductsByRatingParams, EditableProduct, Category, EditableCategory, Supplier, EditableSupplier, Address, EditableAddress } from "./ODataDemoModel";
import { QProduct, QCategory, QSupplier, QAddress } from "./QODataDemo";
export declare class ODataDemoService<ClientType extends ODataHttpClient> extends ODataService<ClientType> {
    private _QGetProductsByRating?;
    Products(): ProductCollectionService<ClientType>;
    Products(id: ProductId): ProductService<ClientType>;
    Categories(): CategoryCollectionService<ClientType>;
    Categories(id: CategoryId): CategoryService<ClientType>;
    Suppliers(): SupplierCollectionService<ClientType>;
    Suppliers(id: SupplierId): SupplierService<ClientType>;
    GetProductsByRating(params: GetProductsByRatingParams, requestConfig?: ODataHttpClientConfig<ClientType>): ODataResponse<ODataCollectionResponseV2<Product>>;
}
export declare class ProductService<ClientType extends ODataHttpClient> extends EntityTypeServiceV2<ClientType, Product, EditableProduct, QProduct> {
    private _Category?;
    private _Supplier?;
    constructor(client: ClientType, basePath: string, name: string);
    Category(): CategoryService<ClientType>;
    Supplier(): SupplierService<ClientType>;
}
export declare class ProductCollectionService<ClientType extends ODataHttpClient> extends EntitySetServiceV2<ClientType, Product, EditableProduct, QProduct, ProductId> {
    constructor(client: ClientType, basePath: string, name: string);
}
export declare class CategoryService<ClientType extends ODataHttpClient> extends EntityTypeServiceV2<ClientType, Category, EditableCategory, QCategory> {
    constructor(client: ClientType, basePath: string, name: string);
    Products(): ProductCollectionService<ClientType>;
    Products(id: ProductId): ProductService<ClientType>;
}
export declare class CategoryCollectionService<ClientType extends ODataHttpClient> extends EntitySetServiceV2<ClientType, Category, EditableCategory, QCategory, CategoryId> {
    constructor(client: ClientType, basePath: string, name: string);
}
export declare class SupplierService<ClientType extends ODataHttpClient> extends EntityTypeServiceV2<ClientType, Supplier, EditableSupplier, QSupplier> {
    private _Address?;
    constructor(client: ClientType, basePath: string, name: string);
    Address(): AddressService<ClientType>;
    Products(): ProductCollectionService<ClientType>;
    Products(id: ProductId): ProductService<ClientType>;
}
export declare class SupplierCollectionService<ClientType extends ODataHttpClient> extends EntitySetServiceV2<ClientType, Supplier, EditableSupplier, QSupplier, SupplierId> {
    constructor(client: ClientType, basePath: string, name: string);
}
export declare class AddressService<ClientType extends ODataHttpClient> extends EntityTypeServiceV2<ClientType, Address, EditableAddress, QAddress> {
    constructor(client: ClientType, basePath: string, name: string);
}

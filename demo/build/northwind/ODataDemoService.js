import { ODataService, EntityTypeServiceV2, EntitySetServiceV2 } from "@odata2ts/odata-service";
import { QProductId, QCategoryId, QSupplierId, QGetProductsByRating, qProduct, qCategory, qSupplier, qAddress } from "./QODataDemo";
export class ODataDemoService extends ODataService {
    _QGetProductsByRating;
    Products(id) {
        const fieldName = "Products";
        const { client, path } = this.__base;
        return typeof id === "undefined" || id === null
            ? new ProductCollectionService(client, path, fieldName)
            : new ProductService(client, path, new QProductId(fieldName).buildUrl(id));
    }
    Categories(id) {
        const fieldName = "Categories";
        const { client, path } = this.__base;
        return typeof id === "undefined" || id === null
            ? new CategoryCollectionService(client, path, fieldName)
            : new CategoryService(client, path, new QCategoryId(fieldName).buildUrl(id));
    }
    Suppliers(id) {
        const fieldName = "Suppliers";
        const { client, path } = this.__base;
        return typeof id === "undefined" || id === null
            ? new SupplierCollectionService(client, path, fieldName)
            : new SupplierService(client, path, new QSupplierId(fieldName).buildUrl(id));
    }
    async GetProductsByRating(params, requestConfig) {
        if (!this._QGetProductsByRating) {
            this._QGetProductsByRating = new QGetProductsByRating();
        }
        const { addFullPath, client, getDefaultHeaders } = this.__base;
        const url = addFullPath(this._QGetProductsByRating.buildUrl(params));
        const response = await client.get(url, requestConfig, getDefaultHeaders());
        return this._QGetProductsByRating.convertResponse(response);
    }
}
export class ProductService extends EntityTypeServiceV2 {
    _Category;
    _Supplier;
    constructor(client, basePath, name) {
        super(client, basePath, name, qProduct);
    }
    Category() {
        if (!this._Category) {
            const { client, path } = this.__base;
            this._Category = new CategoryService(client, path, "Category");
        }
        return this._Category;
    }
    Supplier() {
        if (!this._Supplier) {
            const { client, path } = this.__base;
            this._Supplier = new SupplierService(client, path, "Supplier");
        }
        return this._Supplier;
    }
}
export class ProductCollectionService extends EntitySetServiceV2 {
    constructor(client, basePath, name) {
        super(client, basePath, name, qProduct, new QProductId(name));
    }
}
export class CategoryService extends EntityTypeServiceV2 {
    constructor(client, basePath, name) {
        super(client, basePath, name, qCategory);
    }
    Products(id) {
        const fieldName = "Products";
        const { client, path } = this.__base;
        return typeof id === "undefined" || id === null
            ? new ProductCollectionService(client, path, fieldName)
            : new ProductService(client, path, new QProductId(fieldName).buildUrl(id));
    }
}
export class CategoryCollectionService extends EntitySetServiceV2 {
    constructor(client, basePath, name) {
        super(client, basePath, name, qCategory, new QCategoryId(name));
    }
}
export class SupplierService extends EntityTypeServiceV2 {
    _Address;
    constructor(client, basePath, name) {
        super(client, basePath, name, qSupplier);
    }
    Address() {
        if (!this._Address) {
            const { client, path } = this.__base;
            this._Address = new AddressService(client, path, "Address");
        }
        return this._Address;
    }
    Products(id) {
        const fieldName = "Products";
        const { client, path } = this.__base;
        return typeof id === "undefined" || id === null
            ? new ProductCollectionService(client, path, fieldName)
            : new ProductService(client, path, new QProductId(fieldName).buildUrl(id));
    }
}
export class SupplierCollectionService extends EntitySetServiceV2 {
    constructor(client, basePath, name) {
        super(client, basePath, name, qSupplier, new QSupplierId(name));
    }
}
export class AddressService extends EntityTypeServiceV2 {
    constructor(client, basePath, name) {
        super(client, basePath, name, qAddress);
    }
}

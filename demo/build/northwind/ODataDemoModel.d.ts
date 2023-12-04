import { DeferredContent } from "@odata2ts/odata-core";
export interface Product {
    /**
     * **Key Property**: This is a key property used to identify the entity.<br/>**Managed**: This property is managed on the server side and cannot be edited.
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `ID` |
     * | Type | `Edm.Int32` |
     * | Nullable | `false` |
     */
    ID: number;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Name` |
     * | Type | `Edm.String` |
     */
    Name: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Description` |
     * | Type | `Edm.String` |
     */
    Description: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `ReleaseDate` |
     * | Type | `Edm.DateTime` |
     * | Nullable | `false` |
     */
    ReleaseDate: string;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `DiscontinuedDate` |
     * | Type | `Edm.DateTime` |
     */
    DiscontinuedDate: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Rating` |
     * | Type | `Edm.Int32` |
     * | Nullable | `false` |
     */
    Rating: number;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Price` |
     * | Type | `Edm.Decimal` |
     * | Nullable | `false` |
     */
    Price: string;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Category` |
     * | Type | `ODataDemo.Category` |
     */
    Category: Category | null | DeferredContent;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Supplier` |
     * | Type | `ODataDemo.Supplier` |
     */
    Supplier: Supplier | null | DeferredContent;
}
export type ProductId = number | {
    ID: number;
};
export interface EditableProduct extends Pick<Product, "ReleaseDate" | "Rating" | "Price">, Partial<Pick<Product, "Name" | "Description" | "DiscontinuedDate">> {
}
export interface Category {
    /**
     * **Key Property**: This is a key property used to identify the entity.<br/>**Managed**: This property is managed on the server side and cannot be edited.
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `ID` |
     * | Type | `Edm.Int32` |
     * | Nullable | `false` |
     */
    ID: number;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Name` |
     * | Type | `Edm.String` |
     */
    Name: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Products` |
     * | Type | `Collection(ODataDemo.Product)` |
     */
    Products: Array<Product> | DeferredContent;
}
export type CategoryId = number | {
    ID: number;
};
export interface EditableCategory extends Partial<Pick<Category, "Name">> {
}
export interface Supplier {
    /**
     * **Key Property**: This is a key property used to identify the entity.<br/>**Managed**: This property is managed on the server side and cannot be edited.
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `ID` |
     * | Type | `Edm.Int32` |
     * | Nullable | `false` |
     */
    ID: number;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Name` |
     * | Type | `Edm.String` |
     */
    Name: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Address` |
     * | Type | `ODataDemo.Address` |
     * | Nullable | `false` |
     */
    Address: Address;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Concurrency` |
     * | Type | `Edm.Int32` |
     * | Nullable | `false` |
     */
    Concurrency: number;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Products` |
     * | Type | `Collection(ODataDemo.Product)` |
     */
    Products: Array<Product> | DeferredContent;
}
export type SupplierId = number | {
    ID: number;
};
export interface EditableSupplier extends Pick<Supplier, "Concurrency">, Partial<Pick<Supplier, "Name">> {
    Address: EditableAddress;
}
export interface Address {
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Street` |
     * | Type | `Edm.String` |
     */
    Street: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `City` |
     * | Type | `Edm.String` |
     */
    City: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `State` |
     * | Type | `Edm.String` |
     */
    State: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `ZipCode` |
     * | Type | `Edm.String` |
     */
    ZipCode: string | null;
    /**
     *
     * OData Attributes:
     * |Attribute Name | Attribute Value |
     * | --- | ---|
     * | Name | `Country` |
     * | Type | `Edm.String` |
     */
    Country: string | null;
}
export interface EditableAddress extends Partial<Pick<Address, "Street" | "City" | "State" | "ZipCode" | "Country">> {
}
export interface GetProductsByRatingParams {
    rating?: number | null;
}

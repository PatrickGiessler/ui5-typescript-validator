import { ConfigFileOptions } from "@odata2ts/odata2ts";

const config: ConfigFileOptions = {
	services: {
		northwind: {
			sourceUrl:
				"https://services.odata.org/V2/(S(31nolp53jmmzxh4b5dkybyfn))/OData/OData.svc/",
			source: "resource/northwind.xml",
			output: "build/northwind"
		}
	}
};

export default config;

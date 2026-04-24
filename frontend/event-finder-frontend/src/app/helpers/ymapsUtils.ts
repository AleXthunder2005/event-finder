import type {IGeocodeResult} from "yandex-maps"

export function handleGeoResult(result: IGeocodeResult) {
    const firstGeoObject = result.geoObjects.get(0);

    let foundAddress = null;

    if (firstGeoObject) {
        const properties = firstGeoObject.properties;

        const location = String(properties.get("description", {}));
        const route = String(properties.get("name", {}));

        foundAddress = {
            location,
            route,
        };
    }

    return foundAddress;
}
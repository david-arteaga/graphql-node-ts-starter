import Bookshelf from 'bookshelf';
import wkx from 'wkx';

export default (bookshelf: Bookshelf) => {
  const proto = bookshelf.Model.prototype;

  bookshelf.Model = class<T extends Bookshelf.Model<T>> extends bookshelf.Model<
    T
  > {
    get geography(): string[] | null {
      return null;
    }
    get geometry(): string[] | null {
      return null;
    }

    // override format function to convert GeoJSON into binary postgis values
    format(attributes: any) {
      if (this.geography) {
        convertAttributesFromGeoJSONToRaw(
          bookshelf,
          attributes,
          this.geography,
          'ST_GeomFromGeoJSON(?)::geography'
        );
      }
      if (this.geometry) {
        convertAttributesFromGeoJSONToRaw(
          bookshelf,
          attributes,
          this.geometry,
          'ST_GeomFromGeoJSON(?)'
        );
      }

      return proto.format.call(this, attributes);
    }

    // override parse function to parse binary postgis values into GeoJSON
    parse(attributes: any) {
      if (this.geography) {
        convertAttributesFromRawToGeoJSON(attributes, this.geography);
      }
      if (this.geometry) {
        convertAttributesFromRawToGeoJSON(attributes, this.geometry);
      }
      return proto.parse.call(this, attributes);
    }
  };
};

const convertAttributesFromRawToGeoJSON = (attributes: any, keys: string[]) => {
  keys.forEach(key => {
    const hexValue = attributes[key];
    if (hexValue !== undefined && hexValue !== null) {
      const geoJSON: GeoJSON = wkx.Geometry.parse(
        Buffer.from(hexValue, 'hex')
      ).toGeoJSON() as any;
      switch (geoJSON.type) {
        case PointType: {
          const point: Point = {
            __type: PointType,
            lon: geoJSON.coordinates[0],
            lat: geoJSON.coordinates[1]
          };
          attributes[key] = point;
          break;
        }
        case MultiPointType: {
          const points: MultiPoint = geoJSON.coordinates.map(([lon, lat]) => ({
            lon,
            lat
          })) as MultiPoint;
          points.__type = MultiPointType;
          attributes[key] = points;
          break;
        }
        default: {
          attributes[key] = geoJSON;
        }
      }
    }
  });
};

const convertAttributesFromGeoJSONToRaw = (
  bookshelf: Bookshelf,
  attributes: any,
  keys: string[],
  rawString: string
) => {
  keys.forEach(key => {
    const value = attributes[key] as TransformedGeoJSON;
    if (value !== undefined && value !== null) {
      if (value.__type === MultiPointType) {
        const geoJSONMultiPoint: GeoJSONMultiPoint = {
          type: MultiPointType,
          coordinates: value.map(
            ({ lon, lat }) => [lon, lat] as [longitude, latitude]
          )
        };
        if (geoJSONMultiPoint.coordinates.length === 0) {
          delete attributes[key];
          return;
        }
        attributes[key] = bookshelf.knex.raw(
          rawString,
          JSON.stringify(geoJSONMultiPoint)
          // `{"type":"MultiPoint","coordinates":[${geoJSONMultiPoint.coordinates.join(
          //   ' '
          // )}]}`
        );
      } else if (value.__type === PointType) {
        const geoJSONPoint: GeoJSONPoint = {
          type: PointType,
          coordinates: [value.lon, value.lat]
        };
        attributes[key] = bookshelf.knex.raw(
          rawString,
          JSON.stringify(geoJSONPoint)
          // `{"type":"MultiPoint","coordinates":[${geoJSONPoint.coordinates.join(
          //   ' '
          // )}]}`
        );
      } else {
        attributes[key] = bookshelf.knex.raw(rawString, JSON.stringify(value));
      }
    }
  });
};

export const PointType = 'Point';
export const MultiPointType = 'MultiPoint';

export type TransformedGeoJSON = Point | MultiPoint;

export interface LatLon {
  lon: number;
  lat: number;
}

export type Point = LatLon & {
  __type: typeof PointType;
};

export type MultiPoint = LatLon[] & { __type: typeof MultiPointType };

export type longitude = number;
export type latitude = number;

export type GeoJSON = GeoJSONPoint | GeoJSONMultiPoint;

export type GeoJSONMultiPoint = {
  type: 'MultiPoint';
  coordinates: [longitude, latitude][];
};

export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [longitude, latitude];
};

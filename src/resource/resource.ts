import { HttpStatus } from '@nestjs/common';

export class Resource {
  static successResponse(data: any) {
    if (!data) {
      return { status: { code: HttpStatus.OK, message: 'OK' } };
    }

    if (data.items) {
      const { items, links, meta } = data;

      items.map((item: any) => {
        return this.mapResponse(item);
      });

      return {
        data: items,
        links,
        meta,
        status: { code: HttpStatus.OK, message: 'OK' },
      };
    } else {
      const response = this.mapResponse(data);

      return { data: response, status: { code: HttpStatus.OK, message: 'OK' } };
    }
  }

  static errorResponse(error: any) {
    return {
      status: 'error',
      message: error.message || 'An unexpected error occurred',
    };
  }

  static mapResponse(item: any) {
    return item;
  }
}

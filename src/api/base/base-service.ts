import { Model } from '../../model/model';
import { Inject } from '../../di';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseService {
  constructor(@Inject(Model) protected model: Model) {}
}

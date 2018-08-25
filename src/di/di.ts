import { injectable, inject, Container } from 'inversify';

/**
 * Default DI container
 */
const container = new Container();

/**
 * Annotation to put on classes so they are registered in the DI container and can be injected later
 *
 * ex.
 *
 * @Injectable()
 * class SomeService {
 *  ...
 * }
 */
export function Injectable(): ClassDecorator {
  return function(target: any) {
    const value = injectable()(target);
    const symbol = assignAndGetSymbolForType(target);
    container
      .bind(symbol)
      .to(target)
      .inSingletonScope();
    return value;
  };
}

/**
 * Annotation to put on constructor parameters, so the DI container provides those dependencies
 * to the class when it is instantiated.
 *
 * ex.
 * @Injectable()
 * class OtherClass {
 *   constructor(
 *     @Inject(SomeService) private someService: SomeService
 *   ) {}
 * }
 */
export function Inject(
  type: any
): (target: any, targetKey: string, index?: number | undefined) => void {
  return (target: any, targetKey: string, index: number | undefined) =>
    inject(getTypeSymbol(type))(target, targetKey as any, index);
}

/**
 * Gets an instance of a class from the default DI container.
 *
 * The class must be annotated with @Injectable()
 *
 * @param target The class that to get an instance of
 */
export const getInstanceDI = <Type>(target: Class<Type>) =>
  container.get<Type>(getTypeSymbol(target));

/**
 * Registers a constant value mapped to a symbol in the default DI container.
 * The symbol value used to register the constant must be the exact same value
 * used to retrieve the constant later with `getInstanceForSymbol`.
 *
 * @param symbol The symbol to map the value to in the default DI container
 * @param value The value to register in the DI container
 */
export const registerContantValueForSymbol = <Type>(
  symbol: symbol,
  value: Type
) => container.bind(symbol).toConstantValue(value);

/**
 * Retrieve the constant value registered for the symbol provided.
 * The symbol must be the exact same value used to register the constant before
 *
 * @param typeSymbol The symbol that was used to register the constant before
 */
export const getInstanceForSymbol = <Type>(typeSymbol: symbol) =>
  container.get<Type>(typeSymbol);

const decorated_class_type_key =
  '@@Inject/___decorated_class_type_function_key';
const assignAndGetSymbolForType = (target: any) => {
  // Check if there has been a value getter already defined
  const previousGetter = target[decorated_class_type_key] as
    | (() => symbol)
    | undefined;
  if (previousGetter !== undefined) {
    console.warn(
      `Type ${
        target.name
      } already has a type symbol getter registered. It will be replaced.`
    );
    return previousGetter();
  }

  // No previous symbol has been assigned, create a new symbol assign a new type symbol getter
  const symbol = Symbol(target.name);
  Object.assign(target, {
    [decorated_class_type_key]: () => symbol
  });
  return symbol;
};

const getTypeSymbol = (target: Function) => {
  const symbolGetter = (target as any)[decorated_class_type_key];
  if (!symbolGetter) {
    throw new Error(
      `Type ${
        target.name
      } does not have a type symbol getter.\nIt most likely has not been annotated with @Inject()`
    );
  }
  return symbolGetter();
};
interface Class<T> {
  new (...args: any[]): T;
}

// export const registerConstantValueForType = <Type> (target: Class<Type>, value: Type) => {
//   const symbol = assignAndGetSymbolForType(target)
//   container.bind(symbol).toConstantValue(value)
// }

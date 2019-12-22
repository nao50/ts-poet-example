import { ClassSpec, CodeBlock, DecoratorSpec, EnumSpec, FileSpec, FunctionSpec, InterfaceSpec, Modifier, PropertySpec, TypeName, TypeNames, Union, SymbolSpecs, ParameterSpec
} from 'ts-poet';
import { SymbolSpec } from 'ts-poet/build/SymbolSpecs';

function camelCase(str): string {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, function(match, group1) {
      return group1.toUpperCase();
  });
}

const observableTypeName = TypeNames.importedType('@rxjs/Observable');
const httpClientTypeName = TypeNames.importedType('HttpClient@@angular/common/http');
const httpHeadersTypeName = TypeNames.importedType('HttpHeaders@@angular/common/http');


let testInterface = InterfaceSpec.create('User')
  .addModifiers(Modifier.EXPORT)
  .addProperty('id', TypeNames.NUMBER, { modifiers: [Modifier.PUBLIC] })
  .addProperty('username', TypeNames.STRING, { optional: true, modifiers: [Modifier.PUBLIC] })
  .addProperty('password', TypeNames.STRING, { optional: true, modifiers: [Modifier.PUBLIC] });

let testClass = ClassSpec.create('HogeService')
  .addModifiers(Modifier.EXPORT)
  .addDecorator(
    DecoratorSpec.create(SymbolSpec.from('Injectable@@angular/core'))
      .addParameter(undefined, '{ providedIn: \'root\' }')
  )
  .cstr(
    FunctionSpec.createConstructor()
      .addParameter('httpClient', httpClientTypeName, { modifiers: [Modifier.PRIVATE] })
  )
  .addFunction(
      FunctionSpec.create('listUsers')
        .returns(TypeNames.parameterizedType(observableTypeName, testInterface.name))
        .addCodeBlock(
          CodeBlock.empty()
            .add("const url = 'https://example.com';\n")
            .addStatement("const httpOptions = { headers: new %T({ 'Content-Type': 'application/json' }) }", httpHeadersTypeName)
            .addStatement("return this.httpClient.get<%T[]>(url)", testInterface.name)
        )
  );

console.log(FileSpec.create('Test').addInterface(testInterface).addClass(testClass).toString());



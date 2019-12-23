// import { ClassSpec, CodeBlock, DecoratorSpec, EnumSpec, FileSpec, FunctionSpec, InterfaceSpec, Modifier, PropertySpec, TypeName, TypeNames, Union, SymbolSpecs, ParameterSpec
// } from 'ts-poet';
// import { SymbolSpec } from 'ts-poet/build/SymbolSpecs';

// function camelCase(str): string {
//   str = str.charAt(0).toLowerCase() + str.slice(1);
//   return str.replace(/[-_](.)/g, function(match, group1) {
//       return group1.toUpperCase();
//   });
// }

// const observableTypeName = TypeNames.importedType('@rxjs/Observable');
// const httpClientTypeName = TypeNames.importedType('HttpClient@@angular/common/http');
// const httpHeadersTypeName = TypeNames.importedType('HttpHeaders@@angular/common/http');


// let testInterface = InterfaceSpec.create('User')
//   .addModifiers(Modifier.EXPORT)
//   .addProperty('id', TypeNames.NUMBER, { modifiers: [Modifier.PUBLIC] })
//   .addProperty('username', TypeNames.STRING, { optional: true, modifiers: [Modifier.PUBLIC] })
//   .addProperty('password', TypeNames.STRING, { optional: true, modifiers: [Modifier.PUBLIC] });

// let testClass = ClassSpec.create('UserService')
//   .addModifiers(Modifier.EXPORT)
//   .addDecorator(
//     DecoratorSpec.create(SymbolSpec.from('Injectable@@angular/core'))
//       .addParameter(undefined, '{ providedIn: \'root\' }')
//   )
//   .cstr(
//     FunctionSpec.createConstructor()
//       .addParameter('httpClient', httpClientTypeName, { modifiers: [Modifier.PRIVATE] })
//   )
//   .addFunction(
//       FunctionSpec.create('listUsers')
//         .returns(TypeNames.parameterizedType(observableTypeName, testInterface.name))
//         .addCodeBlock(
//           CodeBlock.empty()
//             .add("const url = 'https://example.com';\n")
//             .addStatement("const httpOptions = { headers: new %T({ 'Content-Type': 'application/json' }) }", httpHeadersTypeName)
//             .addStatement("return this.httpClient.get<%T[]>(url)", testInterface.name)
//         )
//   );
// console.log(FileSpec.create('Test').addInterface(testInterface).addClass(testClass).toString());

import { ClassSpec, CodeBlock, DecoratorSpec, EnumSpec, FileSpec, FunctionSpec, InterfaceSpec, Modifier, PropertySpec, TypeName, TypeNames, Union, SymbolSpecs, ParameterSpec } from 'ts-poet';
import { SymbolSpec } from 'ts-poet/build/SymbolSpecs';
import fs from 'fs';
import yaml from 'js-yaml';

import $RefParser from "json-schema-ref-parser";
import { OpenAPISchema } from './types/open-api';

const specFile = yaml.safeLoad(fs.readFileSync('./api.yaml', 'utf8'));

$RefParser.dereference(specFile, (err, resolvedSpec) => {
  Object.keys(resolvedSpec.components.schemas).forEach((key1) => {
    let schema = resolvedSpec.components.schemas[key1] as OpenAPISchema;
    let iface = InterfaceSpec.create(`${key1}`).addModifiers(Modifier.EXPORT)

    if (schema.properties) {
      Object.keys(schema.properties).forEach((key2) => {
        iface = iface.addProperty(`${key2}`, getType(schema.properties[key2]), { modifiers: [Modifier.PUBLIC] })
      });

      let s = FileSpec.create('Test').addInterface(iface).toString()
      fs.writeFile(`lib/${key1}.ts`, s, function (err) {
        if (err) {
            throw err;
        }
      });

    } else if(schema.type) {
      console.log(schema)
      // writeFile(`lib/${key}.ts`, JSON.stringify(parser.spec.components.schemas.Pet));
    }
  });
});

function getType(prop: OpenAPISchema): string {
  switch (prop.type) {
    case 'integer':
      return 'number';
    case 'string':
      return 'string';
    default:
      return 'unknown';
  }
}

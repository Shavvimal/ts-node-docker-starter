// ================================================================================================================================
// Use TypeScript to describe the shape of objects and functions in your code.
// Using the any type is equivalent to opting out of type checking for a variable
type Result = "success" | "failure";
function verifyResult(result: Result) {
  if (result === "success") {
    console.log("Passed");
  } else {
    console.log("Failed");
  }
}
// ================================================================================================================================
// enums
// enums are used to define a set of named constants and define standards that can be reused in your code base.
// Best to export enums one time at the global level, and then let other classes import and use the enums.
// Assume that you want to create a set of possible actions to capture the events in your code base.
// TypeScript provides both numeric and string-based enums.
enum EventType {
  Create,
  Delete,
  Update,
}
class InfraEvent {
  constructor(event: EventType) {
    if (event === EventType.Create) {
      // Call for other function
      console.log(`Event Captured :${event}`);
    }
  }
}

let eventSource: EventType = EventType.Create;
const eventExample = new InfraEvent(eventSource);
// ================================================================================================================================
// Interfaces
// An interface is a contract for the class. If you create a contract, then your users must comply with the contract.
// Here, an interface is used to standardize the props and ensure that callers provide the expected parameter when using the class.
import { Stack, App } from "aws-cdk-lib";
import { Construct } from "constructs";

interface BucketProps {
  name: string;
  region: string;
  encryption: boolean;
}

class S3Bucket extends Stack {
  constructor(scope: Construct, props: BucketProps) {
    super(scope);
    console.log(props.name);
  }
}

const app = App();

const myS3Bucket = new S3Bucket(app, {
  name: "my-bucket",
  region: "us-east-1",
  encryption: false,
});
// Some properties can only be modified when an object is first instantiated.
// You can specify this by putting readonly before the name of the property
interface Position {
  readonly latitude: number;
  readonly longitute: number;
}
// ================================================================================================================================
// Extend interfaces
// Extending interfaces reduces duplication, because you don't have to copy the properties between interfaces
// Also, the reader of your code can easily understand the relationships in your application.
interface BaseInterface {
  name: string;
}

interface EncryptedVolume extends BaseInterface {
  keyName: string;
}

interface UnencryptedVolume extends BaseInterface {
  tags: string[];
}
// ================================================================================================================================
// Avoid empty interfaces
// We recommend that you avoid empty interfaces due to the potential risks they create.
// The myS3Bucket1 and myS3Bucket2 objects are both valid
// They follow different standards because the interface doesn’t enforce any contracts.
// The following code will compile and print the properties but this introduces inconsistency in your application.
interface BucketPropsEmpty {}

class S3BucketExample implements BucketPropsEmpty {
  constructor(props: BucketPropsEmpty) {
    console.log(props);
  }
}

const myS3Bucket1 = new S3BucketExample({
  name: "my-bucket",
  region: "us-east-1",
  encryption: false,
});

const myS3Bucket2 = new S3BucketExample({
  name: "my-bucket",
  // No region or encryption
});
/**
 *  ================================================================================================================================
 * Factories
 * In an Abstract Factory pattern, an interface is responsible for creating a factory of related objects without explicitly specifying their classes
 * For example, you can create a Lambda factory for creating Lambda functions.
 * Instead of creating a new Lambda function within your construct, you’re delegating the creation process to the factory.
 * See more: https://refactoring.guru/design-patterns/abstract-factory/typescript/example
 */

/** ================================================================================================================================
 * Destructuring on properties
 * Use Desctructuring on properties to avoid repeating the same property name multiple times.
 */

const object = {
  objname: "obj",
  scope: "this",
};

const oName = object.objname;
const oScop = object.scope;

const { scope, objname } = object;

// ================================================================================================================================
// Define standard naming conventions
// Enforcing a naming convention keeps the code base consistent and reduces overhead when thinking about how to name a variable. We recommend the following:

// Reccomendations:
// Use camelCase for variable and function names.
// Use PascalCase for class names and interface names.
// Use camelCase for interface members.
// Use PascalCase for type names and enum names.
// Name files with camelCase (for example, ebsVolumes.tsx or storage.tsb)

/**
 * ================================================================================================================================
 * Don’t use the var keyword
 * The let statement is used to declare a local variable in TypeScript.
 * It’s similar to the var keyword, but it has some restrictions in scoping compared to the var keyword.
 * A variable declared in a block with let is only available for use within that block.
 * The var keyword has global scope, which means that it’s available and can be accessed only within that function.
 *  You can re-declare and update var variables. It’s a best practice to avoid using the var keyword.
 */

/**
 * ================================================================================================================================
 * Use access modifiers
 * Access modifiers are keywords that set the accessibility of properties and methods in classes.
 * The private modifier in TypeScript limits visibility to the same class only.
 * When you add the private modifier to a property or method, you can access that property or method within the same class.
 * The public modifier allows class properties and methods to be accessible from all locations.
 * If you don’t specify any access modifiers for properties and methods, they will take the public modifier by default.
 * The protected modifier allows properties and methods of a class to be accessible within the same class and within subclasses.
 * Use the protected modifier when you expect to create subclasses
 */

// * ================================================================================================================================
//  Discriminating Unions
//  Discriminating Unions are a way to create a union of types that all have a common property.
//  https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html

type NetworkLoadingState = {
  state: "loading";
};
type NetworkFailedState = {
  state: "failed";
  code: number;
};
type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// Create a type which represents only one of the above types
// but you aren't sure which it is yet.
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function logger(state: NetworkState): string {
  // Right now TypeScript does not know which of the three
  // potential types state could be.

  // Trying to access a property which isn't shared
  // across all types will raise an error
  state.code;
  // Property 'code' does not exist on type 'NetworkState'.
  //   Property 'code' does not exist on type 'NetworkLoadingState'.

  // By switching on state, TypeScript can narrow the union
  // down in code flow analysis
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // The type must be NetworkFailedState here,
      // so accessing the `code` field is safe
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}

class Parent {
  a() {
    this.b();
    console.log('a');
  }
}
class Child extends Parent {
  b() {
    console.log('b');
  }
}
let child = new Child();
child.a(); // b

let parent = new Parent();
parent.b();// TypeError: parent.b is not a function
export class Etusivu {
  heading = 'JUKU';
  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}

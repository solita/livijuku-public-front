import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class NotificationOfIncompleteInformation {
  constructor(controller){
    this.controller = controller;
  }
}
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.component.html',
  styleUrl: 'image-upload.component.scss',
  standalone: true
})
export class ImageUploadComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  @Input() rounded: boolean = false;

  @Input() size: 'normal' | 'small' = 'normal';
  @Input() customStyle: string | undefined;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl | undefined = undefined;
  base64Image: string | undefined = undefined;

  constructor(private sanitizer: DomSanitizer) {
  }

  get styleImage() {
    return `${this.sizeValue};${this.roundedStyle}${this.customStyle ? ';' + this.customStyle : ''}`;
  }

  get sizeValue() {

    if (this.size == 'normal') {
      return 'width: 200px; height: 200px'
    }

    return 'width: 100px; height: 100px'
  }

  get roundedStyle() {

    if (this.rounded) {
      return 'border-radius: 50%';
    }

    return 'border-radius: 8px';
  }

  triggerFileInput() {
    if(this.croppedImage){
      this.clearReferences()
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = (e: any) => this.defineImage(e.target.result);

      reader.readAsDataURL(file);

      this.imageChangedEvent = event;

    }
  }

  deleteImage(event: Event) {
    event.stopPropagation();
    this.clearReferences();
  }

  defineImage(image?: string) {
    if (image && image?.trim() != '') {
      this.base64Image = image;
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(image);
    }
  }

  public clearReferences() {
    this.croppedImage = undefined;
    this.base64Image = undefined;
    this.imageChangedEvent = null;
    this.fileInput.nativeElement.value = '';
  }

}

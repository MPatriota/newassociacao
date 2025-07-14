import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'image-upload-multiple',
  templateUrl: 'image-upload-multiple.component.html',
  styleUrl: `image-upload-multiple.component.scss`,
  imports: [CommonModule, FormsModule, ButtonModule]
})
export class ImageUploadMultipleComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  // selectedFiles: any[] = [];
  isDragging = false;
  imagesBase64: string[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this.selectedFiles.push({
          //   file: file,
          //   name: file.name,
          //   preview: e.target.result
          // });

          this.imagesBase64.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeFile(index: number) {
    this.imagesBase64.splice(index, 1);
  }

}

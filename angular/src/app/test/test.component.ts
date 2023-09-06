
import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/app.service';

import { map } from 'rxjs/operators';
import { prodacts } from 'src/app/app.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less']
})
export class TestComponent implements OnInit {
  tutorials?: prodacts[] = [];
  currentTutorial?: prodacts | undefined;;
  currentIndex = -1;
  title = '';
  newItem: prodacts = { titles: '', img: '', favori: 0 }; // Define the newItem object

  updatedTitle: string = '';
  addButton:boolean=false;


  constructor(private tutorialService: TutorialService, private router:Router) { }

  ngOnInit(): void {
    this.retrieveTutorials();
    console.log(this.tutorials);
    
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
          )
          
          ).subscribe(data => {
            this.tutorials = data;
            console.log(data)
            console.log(data, "this is the data")
    });
  }

  setActiveTutorial(tutorial: prodacts, index: number): void {
    console.log(tutorial)
    console.log(prodacts)
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  incrementFavori(tutorial: prodacts): void {
    if (tutorial) {
      tutorial.favori = (tutorial.favori as number || 0) + 1;
  
      this.tutorialService.update(tutorial.id || '', { favori: tutorial.favori });
    }
  }

  addItem(): void {
    // Ensure required fields are filled before adding the item
    if (this.newItem.titles && this.newItem.img) {
      this.tutorialService.create(this.newItem).then(() => {
        this.newItem = { titles: '', img: '', favori: 0 }; // Reset newItem after adding
      });
    }
  }
  deleteItem(tutorial: prodacts): void {
    if (tutorial && tutorial.id && this.tutorials) {
      this.tutorials = this.tutorials.filter((item) => item.id !== tutorial.id);
      this.tutorialService.delete(tutorial.id).then(() => {
        // After successful deletion, remove the item from the local array
        // No need to update the array here since it's already done above
      });
    }
  }
  toggleEditMode(tutorial: prodacts): void {
    if (this.currentTutorial === tutorial) {
      // If already in edit mode, cancel edit mode
      this.currentTutorial = undefined;
      this.updatedTitle = '';
    } else {
      this.currentTutorial = tutorial;
      this.updatedTitle = tutorial.titles || '';
    }
  }
  updateTutorial(tutorial: prodacts, updatedTitle: string): void {
    if (tutorial && tutorial.id) {
      this.tutorialService.update(tutorial.id, { titles: updatedTitle })
        .then(() => {
          // Update was successful
          console.log('Tutorial updated successfully');
          this.toggleEditMode(tutorial); // Exit edit mode
        })
        .catch((error) => {
          console.error('Error updating tutorial:', error);
        });
    }
  }

  downloadImage(imageUrl: string | undefined): void {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'tutorial_image.jpg'; // You can specify the desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  imgDetails(id:any):void{
  console.log(id);
  // this.router.navigate(['photo-details', { id: id }]);
  this.router.navigate(['/photo-details', id]);
  
  }

  showForms(){
    this.addButton = !this.addButton;
  }
  
}

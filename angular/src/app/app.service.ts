import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { prodacts } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private dbPath = '/prodacts';
// ProdactsRef
  ProdactsRef: AngularFirestoreCollection<prodacts>;

  constructor(private db: AngularFirestore) {
    this.ProdactsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<prodacts> {
    return this.ProdactsRef;
  }

  create(prodact: prodacts): any {
    return this.ProdactsRef.add({ ...prodact });
  }

  update(id: string, data: any): Promise<void> {
    return this.ProdactsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.ProdactsRef.doc(id).delete();
  }
}
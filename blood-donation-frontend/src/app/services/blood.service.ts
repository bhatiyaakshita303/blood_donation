import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BloodService {

  constructor(private http: HttpClient) {}

  updateBloodStock(id:any,data:any){
    return this.http.put(`https://blood-donation-f1uf.onrender.com/api/blood/${id}`,data);
  }

  deleteBloodStock(id:any){
    return this.http.delete(`https://blood-donation-f1uf.onrender.com/api/blood/${id}`);
  }

}
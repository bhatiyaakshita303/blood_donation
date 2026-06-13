import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class BloodService {

  constructor(private http: HttpClient) {}

  updateBloodStock(id:any,data:any){
    return this.http.put(`http://localhost:5000/api/blood/${id}`,data);
  }

  deleteBloodStock(id:any){
    return this.http.delete(`http://localhost:5000/api/blood/${id}`);
  }

}
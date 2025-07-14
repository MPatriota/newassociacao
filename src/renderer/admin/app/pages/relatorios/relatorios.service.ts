import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private baseUrl = 'http://localhost:3000/relatorios';

  constructor(private http: HttpClient) {}

  getFinanceiroPorPeriodo(dataInicio: string, dataFim: string): Observable<any[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<any[]>(`${this.baseUrl}/financeiro-por-condicao-pagamento`, { params });
  }

  getFinanceiroPorCliente(dataInicio: string, dataFim: string): Observable<any[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<any[]>(`${this.baseUrl}/financeiro-por-cliente`, { params });
  }

  getVendasPorPeriodo(dataInicio: string, dataFim: string): Observable<any[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<any[]>(`${this.baseUrl}/vendas-por-periodo`, { params });
  }
}

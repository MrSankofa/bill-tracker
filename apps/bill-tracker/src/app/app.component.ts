import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrackerComponent } from './tracker/tracker.component';

@Component({
  standalone: true,
  imports: [RouterModule, TrackerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}

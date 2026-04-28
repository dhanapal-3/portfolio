import { Component } from '@angular/core';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';

@Component({
  selector: 'app-root',
  imports: [
    AnimatedBackgroundComponent,
    SiteHeaderComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    AchievementsSectionComponent,
    SkillsSectionComponent,
    ProjectsSectionComponent,
    ExperienceSectionComponent,
    ContactSectionComponent,
    SiteFooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

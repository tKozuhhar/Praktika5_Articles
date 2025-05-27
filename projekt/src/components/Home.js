import React from 'react';

import articles1 from '../images/articles1.jpg';
import articles2 from '../images/articles2.jpg';
import articles3 from '../images/articles3.jpg';
import articles4 from '../images/articles4.jpg';
import articles5 from '../images/articles5.jpg';
import articles6 from '../images/articles6.jpg';

function Home() {
  return (
    <div class="tab-content">
      <div class="tab-pane container active" id="Home">
        <div id="imageCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
            <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={articles1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={articles2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={articles3} className="d-block w-100" alt="Slide 3" />
            </div>
            <div className="carousel-item">
              <img src={articles4} className="d-block w-100" alt="Slide 4" />
            </div>
            <div className="carousel-item">
              <img src={articles5} className="d-block w-100" alt="Slide 5" />
            </div>
            <div className="carousel-item">
              <img src={articles6} className="d-block w-100" alt="Slide 6" />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="jumbotron text-center">
          <h1 className="display-4"> Welcome to the World of Ideas!</h1>
          <p className="lead">Here, everyone can be an author. Share your articles, express your thoughts, and inspire others — 
            and don’t forget to join the conversation.</p>
          <hr className="my-4" />
          <p>Comment, ask questions, debate — this is a space made for open discussion and the exchange of ideas.</p>
          <p>Join a community where every voice matters. </p>
        </div>

      </div>
    </div>
  );
}

export default Home;

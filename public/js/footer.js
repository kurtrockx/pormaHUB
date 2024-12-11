import phLogo2 from "../../src/assets/images/phLogo2.png";
import facebookIcon from "../../src/assets/svg/facebook.svg";
import instagramIcon from "../../src/assets/svg/instagram.svg";
import twitterIcon from "../../src/assets/svg/twitter.svg";
import youtubeIcon from "../../src/assets/svg/youtube.svg";

const footerHTML = `
    <footer>
      <div class="footer-content">
        <div class="logo-left">
          <img src="${phLogo2}" class="logo-image" />
          <div class="logo-title">PORMA HUB</div>
        </div>
        <div class="quick-links">
          <div class="quick-links-content">
            <div class="quick-links-header">QUICK LINKS</div>
            <div class="quick-links-container">
              <a class="quick-links-links" href="profile.html">User Profile</a>
              <a class="quick-links-links" href="cart.html">View Cart</a>
              <a class="quick-links-links" href="store.html">Store</a>
              <a class="quick-links-links" href="about.html">About Us</a>
            </div>
          </div>
        </div>
        <div class="social-links">
          <a href="https://www.facebook.com" class="social-icon"
            ><img src="${facebookIcon}" alt=""
          /></a>
          <a href="https://www.instagram.com" class="social-icon"
            ><img src="${instagramIcon}" alt=""
          /></a>
          <a href="https://www.x.com" class="social-icon"
            ><img src="${twitterIcon}" alt=""
          /></a>
          <a href="https://www.youtube.com" class="social-icon"
            ><img src="${youtubeIcon}" alt=""
          /></a>
        </div>
      </div>
      <div class="rights">© 2024 PORMA HUB. All Rights Reserved.</div>
    </footer>
`;
document.body.insertAdjacentHTML("beforeend", footerHTML);

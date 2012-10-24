// Generated by CoffeeScript 1.3.3
(function() {
  var close_all_modals, first_active, github_template, instagram_template, render_github, render_instagram, render_twitter, reset_active_nav, set_active_nav, show_github, show_instagram, show_profile, show_twitter, twitter_template;

  twitter_template = false;

  github_template = false;

  instagram_template = false;

  show_profile = function(html) {
    var modal;
    modal = $(html);
    $("body").append(modal);
    close_all_modals();
    return modal.modal('show');
  };

  close_all_modals = function() {
    return $(".modal.in").modal('hide');
  };

  render_twitter = function(data) {
    var context;
    context = {
      user: {
        name: data[0].user.name,
        screen_name: data[0].user.screen_name,
        profile_image_url: data[0].user.profile_image_url,
        f_description: data[0].user.description,
        location: data[0].user.location,
        url: data[0].user.url,
        statuses_count: data[0].user.statuses_count,
        friends_count: data[0].user.friends_count,
        followers_count: data[0].user.followers_count
      },
      tweets: data
    };
    show_profile(twitter_template(context));
    return $("#twitter-link").parent().removeClass('loading');
  };

  render_github = function(user_data, repo_data) {
    var context;
    context = {
      user: user_data,
      repos: repo_data
    };
    show_profile(github_template(context));
    return $("#github-link").parent().removeClass('loading');
  };

  render_instagram = function(user_data, photo_data) {
    var context;
    context = {
      user: user_data.data,
      media: photo_data.data
    };
    show_profile(instagram_template(context));
    return $("#instagram-link").parent().removeClass('loading');
  };

  show_twitter = function() {
    var twitter_modal;
    twitter_modal = $(".twitter.modal");
    if (twitter_modal.length) {
      close_all_modals();
      return twitter_modal.modal('show');
    }
    $("#twitter-link").parent().addClass('loading');
    return $.ajax({
      url: "{{site.url}}/templates/twitter.tpl",
      success: function(data) {
        twitter_template = Handlebars.compile(data);
        return $.ajax({
          url: "http://api.twitter.com/1/statuses/user_timeline.json?include_rts=true&screen_name={{site.twitter}}",
          dataType: "jsonp",
          success: render_twitter
        });
      }
    });
  };

  show_github = function() {
    var github_modal;
    github_modal = $(".github.modal");
    if (github_modal.length) {
      close_all_modals();
      return github_modal.modal('show');
    }
    $("#github-link").parent().addClass('loading');
    return $.ajax({
      url: "{{site.url}}/templates/github.tpl",
      success: function(data) {
        github_template = Handlebars.compile(data);
        return $.ajax({
          url: "https://api.github.com/users/{{site.github}}",
          dataType: "jsonp",
          success: function(user_data) {
            return $.ajax({
              url: "https://api.github.com/users/{{site.github}}/repos",
              dataType: "jsonp",
              success: function(repo_data) {
                return render_github(user_data.data, repo_data.data);
              }
            });
          }
        });
      }
    });
  };

  show_instagram = function() {
    var instagram_modal;
    instagram_modal = $(".instagram.modal");
    if (instagram_modal.length) {
      close_all_modals();
      return instagram_modal.modal('show');
    }
    $("#instagram-link").parent().addClass('loading');
    return $.ajax({
      url: "{{site.url}}/templates/instagram.tpl",
      success: function(data) {
        instagram_template = Handlebars.compile(data);
        return $.ajax({
          url: "https://api.instagram.com/v1/users/{{site.instagram_id}}?access_token=18360510.f59def8.d8d77acfa353492e8842597295028fd3",
          dataType: "jsonp",
          success: function(user_data) {
            return $.ajax({
              url: "https://api.instagram.com/v1/users/{{site.instagram_id}}/media/recent?access_token=18360510.f59def8.d8d77acfa353492e8842597295028fd3",
              dataType: "jsonp",
              success: function(photo_data) {
                return render_instagram(user_data, photo_data);
              }
            });
          }
        });
      }
    });
  };

  first_active = false;

  set_active_nav = function(el) {
    var nav;
    nav = $("#links");
    if (!first_active) {
      first_active = nav.find("li.active");
    }
    nav.find("li").removeClass("active");
    return el.addClass("active");
  };

  reset_active_nav = function() {
    var nav;
    nav = $("#links");
    nav.find("li").removeClass("active");
    if (first_active) {
      return first_active.addClass("active");
    }
  };

  $(document).on("click", "#twitter-link", show_twitter);

  $(document).on("click", "#github-link", show_github);

  $(document).on("click", "#instagram-link", show_instagram);

  $(document).on("show", ".twitter.modal", function() {
    return set_active_nav($("#twitter-link").parent());
  });

  $(document).on("show", ".github.modal", function() {
    return set_active_nav($("#github-link").parent());
  });

  $(document).on("show", ".instagram.modal", function() {
    return set_active_nav($("#instagram-link").parent());
  });

  $(document).on("show", ".post.modal", function() {
    var page_name;
    page_name = $(this).data('page-name');
    return set_active_nav($("a[data-page-name=" + page_name + "]").parent());
  });

  $(document).on("hide", ".profile.modal, .post.modal", function() {
    return reset_active_nav();
  });

  $(document).on("click", "ul#links a.static-page", function(e) {
    var el, existing_modal, page_name;
    e.preventDefault();
    el = $(this);
    page_name = el.data('page-name');
    existing_modal = $(".modal[data-page-name=" + page_name + "]");
    if (existing_modal.length > 0) {
      close_all_modals();
      return existing_modal.modal('show');
    }
    el.parent().addClass('loading');
    return $.ajax({
      url: el.attr('href'),
      success: function(data) {
        var modal, post;
        post = $(data).find("li.post");
        modal = $("<div class='modal post' data-page-name='" + page_name + "'>\n  <button class=\"close\" data-dismiss=\"modal\">×</button>\n</div>");
        modal.append(post);
        $("body").append(modal);
        el.parent().removeClass('loading');
        return modal.modal('show');
      }
    });
  });

  $(function() {
    return $(".loading-spinner").spin({
      lines: 9,
      length: 5,
      width: 2,
      radius: 5,
      corners: 1.0,
      rotate: 0,
      trail: 60,
      speed: 1.4
    });
  });

}).call(this);

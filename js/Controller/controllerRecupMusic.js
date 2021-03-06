/**
 * Created by debian on 10/03/17.
 */

//Controller


app.controller("InitController", ['$scope', 'Tracks', 'TrackInitService', '$http', 'TrackBack', 'playlistService', function ($scope, Tracks, TrackInitService, $http, TrackBack, playlistService) {

    $scope.queue = [];

    $scope.top = [];

    $scope.getTopTracks = function () {
        $scope.top = TrackInitService.getTopTracks();
    };

    $scope.hasTop = false;

    if ($scope.top.length > 0) {
        $scope.hasTop = true;
    }

    $scope.getPopulairesTracks = function () {
        $scope.tracksPopular = TrackInitService.getPopular();
        $scope.tracksBuzz = TrackInitService.getBuzz();
    };

    $scope.vote = function(vote, id){
      playlistService.vote(vote, id);
    }


    $scope.addToQueue = function (element) {
        var alreadyExist = false;
        $.each($scope.queue, function (k, v) {
            if (element.id === v.id && alreadyExist === false) {
                alreadyExist = true;
            }
        });


        if (!alreadyExist) {
            var success = false;
            $scope.queue.push(element);
            $http({
                method: 'POST',
                url: 'http://192.168.1.131:6060/add',
                headers: {
                    'Content-type': 'application/json'
                },
                responseType: 'json',
                data: {"entry": element.audio}
            }).then(function (data) {
                console.log(data);
                success = true;

            });

            TrackBack.addToPlaylist({"id": 1, "track_id": element.id}, {});
            TrackBack.addTrack({"track_id": element.id}, {});

            $scope.queue = $scope.getQueue();
        }

    };

    $scope.getQueue = function () {
        return $scope.queue;
    };


    function checkChanged() {

        $.ajax({
            type: 'GET',
            url: 'http://192.168.1.131:6060/idle',
            success: function (data) {
                $.ajax({
                    type: 'GET',
                    url: 'http://192.168.1.131:6060/current',
                    success: function (data) {
                        console.log(data);
                        $('#current_song_title').empty();
                        $('#current_song_title').append(data.song.title);
                        $('#current_song_artist').empty();
                        $('#current_song_artist').append(data.song.artist);
                        $scope.currentSong = data;

                    }
                });
            }

        }).done(function (data) {
            checkChanged();
        });
    }

    $.ajax({
        type: 'GET',
        url: 'http://192.168.1.131:6060/current',
        success: function (data) {
            console.log(data);
            $('#current_song_title').empty();
            $('#current_song_title').append(data.song.title);
            $('#current_song_artist').empty();
            $('#current_song_artist').append(data.song.artist);
            $scope.currentSong = data;
        }
    });

    checkChanged();
}]);

app.controller("SearchController", ['$scope', 'TrackSearchService', function ($scope, Tracks, TrackSearchService) {

    $scope.searchTracks = function () {
        TrackSearchService.search();
        $scope.track = TrackSearchService.getTracks();
        console.log($scope.track);
    }
}]);

app.controller("SearchTypeController", ['$scope', 'TrackSearchTypeService', function ($scope, Tracks, TrackSearchTypeService) {

    $scope.searchTrackType = function () {
        TrackSearchTypeService.searchType();
        $scope.tracks = TrackSearchTypeService.getTracks();
        console.log($scope.tracks);
    }

}]);

app.controller("PlaylistController", ["$scope", 'playlistService', function ($scope, Tracks, Playlist, TrackBack, playlistService) {

    $scope.getPlaylist = function () {
        $scope.playlist = playlistService.getPlaylist();
    }

    $scope.addToPlaylist = function (tid, pid) {
        playlistService.addToPlaylist(tid, pid);
    }

    $scope.removePlaylist = function () {
        playlistService.removePlaylist();
    }

    $scope.removeFromPlaylist = function (id) {
        playlistService.removeFromPlaylist(id);
    }

    $scope.createPlaylist = function (tid) {
        playlistService.createPlaylist(tid);
    }

    $scope.addTrack = function (tid) {
        playlistService.addTrack(tid);
    }

    $scope.vote = function (v, tid) {
        playlistService.votes(v, tid);
    }

}]);

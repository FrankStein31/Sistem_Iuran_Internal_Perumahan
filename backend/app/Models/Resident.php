<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resident extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama_lengkap',
        'no_ktp',
        'foto_ktp',
        'status_penghuni',
        'no_hp',
        'status_nikah',
        'catatan',
    ];

    protected $casts = [
        'status_penghuni' => 'string',
        'status_nikah' => 'string',
    ];

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function currentHouseResident()
    {
        return $this->hasOne(HouseResident::class)->where('is_active', true)->latest();
    }

    public function currentHouse()
    {
        return $this->hasOneThrough(
            House::class,
            HouseResident::class,
            'resident_id',
            'id',
            'id',
            'house_id'
        );
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_residents')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active', 'catatan'])
            ->withTimestamps();
    }
}
